import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicTool } from '@langchain/core/tools';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { MarkdownService } from './markdown.service';
import { AgentRunRepository } from './repositories/agent-run.repository';
import { AgentOutputRepository } from './repositories/agent-output.repository';
import { AgentRunLinkRepository } from './repositories/agent-run-link.repository';
import { BrandProfileRepository } from './repositories/brand-profile.repository';
import { BrandProfile } from './entities/brand-profile.entity';
import { AgentType } from './entities/agent-run.entity';
import { randomUUID } from 'crypto';


@Injectable()
export class AgentService {
  constructor(
    private readonly config: ConfigService,
    private readonly markdown: MarkdownService,
    private readonly runs: AgentRunRepository,
    private readonly outputs: AgentOutputRepository,
    private readonly links: AgentRunLinkRepository,
    private readonly brandProfiles: BrandProfileRepository,
  ) {}

  private buildModel() {
    return new ChatGoogleGenerativeAI({
      apiKey: this.config.getOrThrow<string>('GEMINI_API_KEY'),
      model: this.config.get<string>('GEMINI_MODEL'),
      apiVersion: 'v1',
      temperature: 0.2,
    });
  }

  private buildTools() {
    const calculator = new DynamicTool({
      name: 'calculadora',
      description:
        'Avalia expressões aritméticas simples com + - * / e parênteses. Use ponto para decimais. Ex: 2*(3+4)/5. Não suporta funções nem variáveis.',
      func: async (expression: string) => {
        try {
          const result = Function(`"use strict"; return (${expression});`)();
          return String(result ?? '');
        } catch {
          return 'Erro ao calcular';
        }
      },
    });

    const httpGet = new DynamicTool({
      name: 'httpGet',
      description:
        'Busca conteúdo de uma URL HTTP/HTTPS e retorna apenas texto (até 1200 caracteres). Use para páginas públicas, não realiza busca por palavras-chave.',
      func: async (url: string) => {
        try {
          const res = await fetch(url);
          const text = await res.text();
          return text.slice(0, 1200);
        } catch {
          return 'Erro ao buscar URL';
        }
      },
    });

    return [calculator, httpGet];
  }

  // Auxiliar para reduzir risco de bloqueio por recitação e excesso de tokens
  // Corta entradas muito longas mantendo o início.
  private truncateForSafety(text: string, maxChars: number): string {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars);
  }

  async runAgent(input: string, mdKeys?: string[], type?: AgentType, correlationId?: string, parentRunId?: string, brandProfileId?: string): Promise<{ runId: string | null; correlationId: string | null; output: string }> {
    const run = type
      ? await this.runs.createRun({ type, input, mdKeys: mdKeys ?? null, correlationId: correlationId ?? null, parentRunId: parentRunId ?? null })
      : null;
    if (run && parentRunId) {
      await this.links.createLink(parentRunId, run.id, 'child');
    }

    let brandContext = '';
    if (brandProfileId) {
      const brandProfile = await this.brandProfiles.findById(brandProfileId);
      if (brandProfile) {
        brandContext = `\nPerfil de Marca: ${JSON.stringify({
          nome: brandProfile.nome,
          setor: brandProfile.setor,
          publicoAlvo: brandProfile.publicoAlvo,
          valores: brandProfile.valores,
          tomDeVoz: brandProfile.tomDeVoz,
          identidadeVisual: brandProfile.identidadeVisual,
          diferenciais: brandProfile.diferenciais,
          evitar: brandProfile.evitar,
        })}\n`;
      }
    }

    const model = this.buildModel();
    const tools = this.buildTools();
    const embeds = mdKeys && mdKeys.length ? await this.markdown.getManyMarkdown(mdKeys) : '';
    const guard =
      'Instruções: responda com suas próprias palavras; não reproduza trechos longos de textos de fontes externas; evite transcrever conteúdo protegido; produza sínteses originais e curtas de citações.';
    const raw = embeds ? `${guard}\n\n${embeds}${brandContext}\n\n${input}` : `${guard}${brandContext}\n\n${input}`;
    const finalInput = this.truncateForSafety(raw, 6000);

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'structured-chat-zero-shot-react-description',
      verbose: false,
    });
    try {
      const result = await executor.invoke({ input: finalInput });
      const output = typeof result.output === 'string' ? result.output : JSON.stringify(result.output ?? '');
      if (run) await this.runs.finishRunOk(run.id, safeJsonParse(output));
      if (run) {
        await this.outputs.saveOutput({
          runId: run.id,
          contentText: output,
          contentJson: safeJsonParse(output),
          model: this.config.get<string>('GEMINI_MODEL') ?? null,
          latencyMs: null,
        });
      }
      return { runId: run ? run.id : null, correlationId: run?.correlationId ?? null, output };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      if (run) await this.runs.finishRunError(run.id, message);
      throw e as unknown;
    }
  }

  async runBuscadorData(input: string, correlationId?: string, parentRunId?: string, brandProfileId?: string) {
    return this.runAgent(input, ['buscador-data'], 'buscador-data', correlationId, parentRunId, brandProfileId);
  }

  async runBuscadorInformacoes(input: string, correlationId?: string, parentRunId?: string, brandProfileId?: string) {
    return this.runAgent(input, ['buscador-informacoes'], 'buscador-informacoes', correlationId, parentRunId, brandProfileId);
  }

  async runEscritorDescricao(input: string, correlationId?: string, parentRunId?: string, brandProfileId?: string) {
    return this.runAgent(input, ['escritor-descricao'], 'escritor-descricao', correlationId, parentRunId, brandProfileId);
  }

  async runGeradorPromptImagemPost(input: string, correlationId?: string, parentRunId?: string, brandProfileId?: string) {
    return this.runAgent(input, ['gerador-prompt-imagem-post'], 'gerador-prompt-imagem-post', correlationId, parentRunId, brandProfileId);
  }

  async runPipeline(input: string, tone: 'serio' | 'divertido' | 'persuasivo' | 'inspirador' | 'educativo' = 'serio', visualPrefs?: string, brandProfileId?: string): Promise<string> {
    const pipelineId = randomUUID();
    let brandProfile: BrandProfile | null = null;
    let brandContext = '';

    if (brandProfileId) {
      brandProfile = await this.brandProfiles.findById(brandProfileId);
      if (brandProfile) {
        brandContext = `\nPerfil de Marca: ${JSON.stringify({
          nome: brandProfile.nome,
          setor: brandProfile.setor,
          publicoAlvo: brandProfile.publicoAlvo,
          valores: brandProfile.valores,
          tomDeVoz: brandProfile.tomDeVoz,
          identidadeVisual: brandProfile.identidadeVisual,
          diferenciais: brandProfile.diferenciais,
          evitar: brandProfile.evitar,
        })}\n`;
      }
    }

    const dataRes = await this.runAgent(input, ['buscador-data'], 'buscador-data', pipelineId);
    const dataJson = dataRes.output;
    const infosRes = await this.runAgent(`Dados anteriores:\n${dataJson}\nIdioma: pt-BR`, ['buscador-informacoes'], 'buscador-informacoes', pipelineId, dataRes.runId ?? undefined);
    const infosJson = infosRes.output;
    const descRes = await this.runAgent(
      `tom=${tone}${brandContext}\nObjeto do buscador-informacoes:\n${infosJson}\nGere 3 variações de descrição (curta, média, longa) conforme instruções.`,
      ['escritor-descricao'],
      'escritor-descricao',
      pipelineId,
      infosRes.runId ?? undefined,
    );
    const descJson = descRes.output;
    const promptJson = await this.runAgent(
      `Objeto A (escritor-descricao):\n${descJson}\nObjeto B (buscador-informacoes):\n${infosJson}\nPreferencias visuais: ${visualPrefs ?? ''}${brandContext}`,
      ['gerador-prompt-imagem-post'],
      'gerador-prompt-imagem-post',
      pipelineId,
      descRes.runId ?? undefined,
    );
    try {
      const desc = JSON.parse(descJson);
      const prompt = JSON.parse(promptJson.output);
      const out = JSON.stringify({ escritorDescricao: desc, promptImagemPost: prompt });
      await this.runs.createRun({ type: 'pipeline', input, mdKeys: ['buscador-data', 'buscador-informacoes', 'escritor-descricao', 'gerador-prompt-imagem-post'], correlationId: pipelineId });
      return out;
    } catch {
      const out = JSON.stringify({ escritorDescricao: descJson, promptImagemPost: promptJson.output });
      await this.runs.createRun({ type: 'pipeline', input, mdKeys: ['buscador-data', 'buscador-informacoes', 'escritor-descricao', 'gerador-prompt-imagem-post'], correlationId: pipelineId });
      return out;
    }
  }
}

function safeJsonParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}


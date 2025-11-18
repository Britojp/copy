import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';
import { AgentService } from './agent.service';

async function main() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: false,
  });
  try {
    const [sub, ...rest] = process.argv.slice(2);
    const args = [...rest];
    const inputParts: string[] = [];
    let tone = 'serio';
    let visuals = '';
    for (const a of args) {
      if (a.startsWith('--tom=')) {
        tone = a.slice('--tom='.length);
      } else if (a.startsWith('--visuais=')) {
        visuals = a.slice('--visuais='.length);
      } else {
        inputParts.push(a);
      }
    }
    const input = inputParts.join(' ').trim();
    if (!sub || !input) {
      console.error('Uso: npm run ai:agent -- <agente> "sua tarefa"');
      console.error('Agentes: buscador-data | buscador-informacoes | escritor-descricao | gerador-prompt-imagem-post | pipeline | livre');
      console.error('Pipeline flags: --tom=serio|divertido|persuasivo --visuais="preferencias visuais"');
      process.exit(1);
    }
    const agent = app.get(AgentService);
    let output = '';
    switch (sub) {
      case 'buscador-data': {
        const res = await agent.runBuscadorData(input);
        output = res.output;
        break;
      }
      case 'buscador-informacoes': {
        const res = await agent.runBuscadorInformacoes(input);
        output = res.output;
        break;
      }
      case 'escritor-descricao': {
        const res = await agent.runEscritorDescricao(input);
        output = res.output;
        break;
      }
      case 'gerador-prompt-imagem-post': {
        const res = await agent.runGeradorPromptImagemPost(input);
        output = res.output;
        break;
      }
      case 'pipeline': {
        output = await agent.runPipeline(input, tone as any, visuals);
        break;
      }
      case 'livre': {
        const res = await agent.runAgent(input);
        output = res.output;
        break;
      }
      default:
        console.error(`Agente desconhecido: ${sub}`);
        process.exit(1);
    }
    console.log(output);
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



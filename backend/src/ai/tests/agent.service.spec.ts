import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { AgentService } from '../services/agent.service';
import { MarkdownService } from '../services/markdown.service';
import { PromptSecurityService } from '../services/prompt-security.service';
import { AgentRunRepository } from '../repositories/agent-run.repository';
import { AgentOutputRepository } from '../repositories/agent-output.repository';
import { AgentRunLinkRepository } from '../repositories/agent-run-link.repository';
import { BrandProfileRepository } from '../repositories/brand-profile.repository';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

jest.mock('langchain/agents');
jest.mock('@langchain/google-genai');

describe('AgentService', () => {
  let service: AgentService;
  let securityService: jest.Mocked<PromptSecurityService>;
  let markdownService: jest.Mocked<MarkdownService>;
  let runsRepository: jest.Mocked<AgentRunRepository>;
  let outputsRepository: jest.Mocked<AgentOutputRepository>;
  let linksRepository: jest.Mocked<AgentRunLinkRepository>;
  let brandProfilesRepository: jest.Mocked<BrandProfileRepository>;

  const mockRun = {
    id: 'run-123',
    correlationId: 'corr-123',
  };

  const mockExecutor = {
    invoke: jest.fn(),
  };

  beforeEach(async () => {
    const mockSecurityService = {
      validateAndSanitize: jest.fn((input) => input),
      detectRepetitionAttack: jest.fn(() => false),
      validateTokenCount: jest.fn(() => true),
    };

    const mockMarkdownService = {
      getManyMarkdown: jest.fn().mockResolvedValue(''),
    };

    const mockRunsRepository = {
      createRun: jest.fn().mockResolvedValue(mockRun),
      finishRunOk: jest.fn().mockResolvedValue(undefined),
      finishRunError: jest.fn().mockResolvedValue(undefined),
    };

    const mockOutputsRepository = {
      saveOutput: jest.fn().mockResolvedValue(undefined),
    };

    const mockLinksRepository = {
      createLink: jest.fn().mockResolvedValue(undefined),
    };

    const mockBrandProfilesRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    (initializeAgentExecutorWithOptions as jest.Mock).mockResolvedValue(mockExecutor);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(() => 'test-api-key'),
            get: jest.fn(() => 'gemini-1.5-flash-8b'),
          },
        },
        {
          provide: MarkdownService,
          useValue: mockMarkdownService,
        },
        {
          provide: PromptSecurityService,
          useValue: mockSecurityService,
        },
        {
          provide: AgentRunRepository,
          useValue: mockRunsRepository,
        },
        {
          provide: AgentOutputRepository,
          useValue: mockOutputsRepository,
        },
        {
          provide: AgentRunLinkRepository,
          useValue: mockLinksRepository,
        },
        {
          provide: BrandProfileRepository,
          useValue: mockBrandProfilesRepository,
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
    securityService = module.get(PromptSecurityService);
    markdownService = module.get(MarkdownService);
    runsRepository = module.get(AgentRunRepository);
    outputsRepository = module.get(AgentOutputRepository);
    linksRepository = module.get(AgentRunLinkRepository);
    brandProfilesRepository = module.get(BrandProfileRepository);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('runAgent', () => {
    it('deve validar e sanitizar input', async () => {
      const input = 'test input';
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent(input, [], 'buscador-data');

      expect(securityService.validateAndSanitize).toHaveBeenCalledWith(input);
    });

    it('deve bloquear input com ataque de repetição', async () => {
      securityService.detectRepetitionAttack.mockReturnValue(true);

      await expect(
        service.runAgent('test', [], 'buscador-data')
      ).rejects.toThrow(BadRequestException);
    });

    it('deve bloquear input que excede limite de tokens', async () => {
      securityService.validateTokenCount.mockReturnValue(false);

      await expect(
        service.runAgent('test', [], 'buscador-data')
      ).rejects.toThrow(BadRequestException);
    });

    it('deve criar run quando type é fornecido', async () => {
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent('test', [], 'buscador-data');

      expect(runsRepository.createRun).toHaveBeenCalledWith({
        type: 'buscador-data',
        input: 'test',
        mdKeys: [],
        correlationId: null,
        parentRunId: null,
      });
    });

    it('deve criar link quando parentRunId é fornecido', async () => {
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent('test', [], 'buscador-data', undefined, 'parent-123');

      expect(linksRepository.createLink).toHaveBeenCalledWith('parent-123', 'run-123', 'child');
    });

    it('deve incluir contexto de marca quando brandProfileId é fornecido', async () => {
      const brandProfile = {
        id: 'brand-123',
        nome: 'Test Brand',
        setor: 'Tech',
        publicoAlvo: {},
        valores: {},
        tomDeVoz: {},
        identidadeVisual: {},
        diferenciais: {},
        evitar: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      brandProfilesRepository.findById.mockReset();
      brandProfilesRepository.findById.mockResolvedValue(brandProfile as any);
      mockExecutor.invoke.mockClear();
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent('test', [], 'buscador-data', undefined, undefined, 'brand-123');

      expect(brandProfilesRepository.findById).toHaveBeenCalledWith('brand-123');
      expect(mockExecutor.invoke).toHaveBeenCalled();
      
      const invokeCall = mockExecutor.invoke.mock.calls[0][0];
      const inputStr = String(invokeCall.input);
      expect(inputStr).toContain('Perfil de Marca');
      expect(inputStr).toContain('Test Brand');
      expect(inputStr).toContain('Tech');
    });

    it('deve carregar prompts markdown quando mdKeys são fornecidos', async () => {
      markdownService.getManyMarkdown.mockResolvedValue('prompt content');
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent('test', ['buscador-data'], 'buscador-data');

      expect(markdownService.getManyMarkdown).toHaveBeenCalledWith(['buscador-data']);
    });

    it('deve salvar output quando run é criado', async () => {
      mockExecutor.invoke.mockResolvedValue({ output: 'result' });

      await service.runAgent('test', [], 'buscador-data');

      expect(outputsRepository.saveOutput).toHaveBeenCalledWith({
        runId: 'run-123',
        contentText: 'result',
        contentJson: 'result',
        model: 'gemini-1.5-flash-8b',
        latencyMs: null,
      });
    });

    it('deve finalizar run com erro em caso de exceção', async () => {
      const error = new Error('Test error');
      mockExecutor.invoke.mockRejectedValue(error);

      await expect(
        service.runAgent('test', [], 'buscador-data')
      ).rejects.toThrow('Test error');

      expect(runsRepository.finishRunError).toHaveBeenCalledWith('run-123', 'Test error');
    });

    it('deve retornar output parseado corretamente', async () => {
      mockExecutor.invoke.mockResolvedValue({ output: '{"result": "success"}' });

      const result = await service.runAgent('test', [], 'buscador-data');

      expect(result).toEqual({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{"result": "success"}',
      });
    });
  });

  describe('runBuscadorData', () => {
    it('deve chamar runAgent com tipo correto', async () => {
      const spy = jest.spyOn(service, 'runAgent').mockResolvedValue({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{}',
      });

      await service.runBuscadorData('input', 'corr-123', 'parent-123', 'brand-123');

      expect(spy).toHaveBeenCalledWith(
        'input',
        ['buscador-data'],
        'buscador-data',
        'corr-123',
        'parent-123',
        'brand-123'
      );
    });
  });

  describe('runBuscadorInformacoes', () => {
    it('deve chamar runAgent com tipo correto', async () => {
      const spy = jest.spyOn(service, 'runAgent').mockResolvedValue({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{}',
      });

      await service.runBuscadorInformacoes('input');

      expect(spy).toHaveBeenCalledWith(
        'input',
        ['buscador-informacoes'],
        'buscador-informacoes',
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('runEscritorDescricao', () => {
    it('deve chamar runAgent com tipo correto', async () => {
      const spy = jest.spyOn(service, 'runAgent').mockResolvedValue({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{}',
      });

      await service.runEscritorDescricao('input');

      expect(spy).toHaveBeenCalledWith(
        'input',
        ['escritor-descricao'],
        'escritor-descricao',
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('runGeradorPromptImagemPost', () => {
    it('deve chamar runAgent com tipo correto', async () => {
      const spy = jest.spyOn(service, 'runAgent').mockResolvedValue({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{}',
      });

      await service.runGeradorPromptImagemPost('input');

      expect(spy).toHaveBeenCalledWith(
        'input',
        ['gerador-prompt-imagem-post'],
        'gerador-prompt-imagem-post',
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('runPipeline', () => {
    it('deve executar pipeline completo', async () => {
      const spy = jest.spyOn(service, 'runAgent')
        .mockResolvedValueOnce({
          runId: 'run-1',
          correlationId: 'pipeline-123',
          output: '{"datas": []}',
        })
        .mockResolvedValueOnce({
          runId: 'run-2',
          correlationId: 'pipeline-123',
          output: '{"itens": []}',
        })
        .mockResolvedValueOnce({
          runId: 'run-3',
          correlationId: 'pipeline-123',
          output: '{"itens": []}',
        })
        .mockResolvedValueOnce({
          runId: 'run-4',
          correlationId: 'pipeline-123',
          output: '{"itens": []}',
        });

      runsRepository.createRun.mockResolvedValue(mockRun as any);

      const result = await service.runPipeline('input', 'serio', 'visual', 'brand-123');

      expect(spy).toHaveBeenCalledTimes(4);
      expect(result).toContain('escritorDescricao');
      expect(result).toContain('promptImagemPost');
    });
  });
});


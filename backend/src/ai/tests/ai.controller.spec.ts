import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from '../controllers/ai.controller';
import { AgentService } from '../services/agent.service';
import { BrandProfileRepository } from '../repositories/brand-profile.repository';
import { BadRequestException } from '@nestjs/common';

describe('AiController', () => {
  let controller: AiController;
  let agentService: jest.Mocked<AgentService>;
  let brandProfileRepository: jest.Mocked<BrandProfileRepository>;

  beforeEach(async () => {
    const mockAgentService = {
      runBuscadorData: jest.fn(),
      runBuscadorInformacoes: jest.fn(),
      runEscritorDescricao: jest.fn(),
      runGeradorPromptImagemPost: jest.fn(),
      runPipeline: jest.fn(),
    };

    const mockBrandProfileRepository = {
      listAll: jest.fn(),
      findById: jest.fn(),
      createOne: jest.fn(),
      updatePartial: jest.fn(),
      deleteById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AgentService,
          useValue: mockAgentService,
        },
        {
          provide: BrandProfileRepository,
          useValue: mockBrandProfileRepository,
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    agentService = module.get(AgentService);
    brandProfileRepository = module.get(BrandProfileRepository);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('buscadorData', () => {
    it('deve chamar agentService e retornar resultado parseado', async () => {
      const mockResponse = {
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{"datas": []}',
      };

      agentService.runBuscadorData.mockResolvedValue(mockResponse);

      const body = { input: 'nicho=médico' };
      const result = await controller.buscadorData(body);

      expect(agentService.runBuscadorData).toHaveBeenCalledWith(
        body.input,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual({
        runId: 'run-123',
        correlationId: 'corr-123',
        output: { datas: [] },
      });
    });

    it('deve retornar objeto com result se output não for JSON válido', async () => {
      const mockResponse = {
        runId: 'run-123',
        correlationId: 'corr-123',
        output: 'texto não JSON',
      };

      agentService.runBuscadorData.mockResolvedValue(mockResponse);

      const result = await controller.buscadorData({ input: 'test' });

      expect(result.output).toEqual({ result: 'texto não JSON' });
    });
  });

  describe('buscadorInformacoes', () => {
    it('deve chamar agentService corretamente', async () => {
      const mockResponse = {
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{"itens": []}',
      };

      agentService.runBuscadorInformacoes.mockResolvedValue(mockResponse);

      const body = { input: 'dados', correlationId: 'corr-123' };
      await controller.buscadorInformacoes(body);

      expect(agentService.runBuscadorInformacoes).toHaveBeenCalledWith(
        body.input,
        body.correlationId,
        undefined,
        undefined
      );
    });
  });

  describe('escritorDescricao', () => {
    it('deve chamar agentService corretamente', async () => {
      const mockResponse = {
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{"itens": []}',
      };

      agentService.runEscritorDescricao.mockResolvedValue(mockResponse);

      await controller.escritorDescricao({ input: 'test' });

      expect(agentService.runEscritorDescricao).toHaveBeenCalled();
    });
  });

  describe('geradorPromptImagemPost', () => {
    it('deve chamar agentService corretamente', async () => {
      const mockResponse = {
        runId: 'run-123',
        correlationId: 'corr-123',
        output: '{"itens": []}',
      };

      agentService.runGeradorPromptImagemPost.mockResolvedValue(mockResponse);

      await controller.geradorPromptImagemPost({ input: 'test' });

      expect(agentService.runGeradorPromptImagemPost).toHaveBeenCalled();
    });
  });

  describe('pipeline', () => {
    it('deve executar pipeline completo', async () => {
      const mockOutput = '{"escritorDescricao": {}, "promptImagemPost": {}}';
      agentService.runPipeline.mockResolvedValue(mockOutput);

      const body = {
        input: 'nicho=médico',
        tone: 'serio' as const,
        visualPrefs: 'cores suaves',
      };

      const result = await controller.pipeline(body);

      expect(agentService.runPipeline).toHaveBeenCalledWith(
        body.input,
        'serio',
        'cores suaves',
        undefined
      );
      expect(result).toEqual({
        escritorDescricao: {},
        promptImagemPost: {},
      });
    });

    it('deve usar tone padrão se não fornecido', async () => {
      agentService.runPipeline.mockResolvedValue('{}');

      await controller.pipeline({ input: 'test' });

      expect(agentService.runPipeline).toHaveBeenCalledWith(
        'test',
        'serio',
        undefined,
        undefined
      );
    });
  });

  describe('brand-profiles', () => {
    it('deve listar todos os perfis', async () => {
      const mockProfiles = [{ id: '1', nome: 'Profile 1' }];
      brandProfileRepository.listAll.mockResolvedValue(mockProfiles as any);

      const result = await controller.listBrandProfiles();

      expect(brandProfileRepository.listAll).toHaveBeenCalled();
      expect(result).toEqual(mockProfiles);
    });

    it('deve buscar perfil por ID', async () => {
      const mockProfile = { id: '1', nome: 'Profile 1' };
      brandProfileRepository.findById.mockResolvedValue(mockProfile as any);

      const result = await controller.getBrandProfile('1');

      expect(brandProfileRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProfile);
    });

    it('deve criar novo perfil', async () => {
      const newProfile = { nome: 'Novo', setor: 'Tech' };
      const created = { id: '1', ...newProfile };
      brandProfileRepository.createOne.mockResolvedValue(created as any);

      const result = await controller.createBrandProfile(newProfile as any);

      expect(brandProfileRepository.createOne).toHaveBeenCalledWith(newProfile);
      expect(result).toEqual(created);
    });

    it('deve atualizar perfil existente', async () => {
      const update = { nome: 'Atualizado' };
      brandProfileRepository.updatePartial.mockResolvedValue(undefined);

      await controller.updateBrandProfile('1', update as any);

      expect(brandProfileRepository.updatePartial).toHaveBeenCalledWith('1', update);
    });

    it('deve deletar perfil', async () => {
      brandProfileRepository.deleteById.mockResolvedValue(undefined);

      await controller.deleteBrandProfile('1');

      expect(brandProfileRepository.deleteById).toHaveBeenCalledWith('1');
    });
  });
});


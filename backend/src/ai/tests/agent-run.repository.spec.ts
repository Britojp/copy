import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRunRepository } from '../repositories/agent-run.repository';
import { AgentRun, AgentType } from '../entities/agent-run.entity';

describe('AgentRunRepository', () => {
  let repository: AgentRunRepository;
  let repo: jest.Mocked<Repository<AgentRun>>;

  const mockRun: AgentRun = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'buscador-data',
    input: 'test input',
    mdKeys: ['buscador-data'],
    outputJson: { result: 'test' },
    status: 'ok',
    errorMessage: null,
    correlationId: 'correlation-123',
    parentRunId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentRunRepository,
        {
          provide: getRepositoryToken(AgentRun),
          useValue: mockRepo,
        },
      ],
    }).compile();

    repository = module.get<AgentRunRepository>(AgentRunRepository);
    repo = module.get(getRepositoryToken(AgentRun));
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  describe('createRun', () => {
    it('deve criar um novo run', async () => {
      const params = {
        type: 'buscador-data' as AgentType,
        input: 'test input',
        mdKeys: ['buscador-data'],
        correlationId: 'correlation-123',
        parentRunId: null,
      };

      repo.create.mockReturnValue(mockRun as any);
      repo.save.mockResolvedValue(mockRun);

      const result = await repository.createRun(params);

      expect(repo.create).toHaveBeenCalledWith({
        type: params.type,
        input: params.input,
        mdKeys: params.mdKeys,
        correlationId: params.correlationId,
        parentRunId: params.parentRunId,
        status: 'ok',
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockRun);
    });

    it('deve criar run com valores null quando não fornecidos', async () => {
      const params = {
        type: 'buscador-data' as AgentType,
        input: 'test input',
      };

      repo.create.mockReturnValue(mockRun as any);
      repo.save.mockResolvedValue(mockRun);

      await repository.createRun(params);

      expect(repo.create).toHaveBeenCalledWith({
        type: params.type,
        input: params.input,
        mdKeys: null,
        correlationId: null,
        parentRunId: null,
        status: 'ok',
      });
    });
  });

  describe('finishRunOk', () => {
    it('deve finalizar run com sucesso', async () => {
      const outputJson = { result: 'success' };
      repo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.finishRunOk(mockRun.id, outputJson);

      expect(repo.update).toHaveBeenCalledWith(mockRun.id, {
        outputJson,
        status: 'ok',
      });
    });
  });

  describe('finishRunError', () => {
    it('deve finalizar run com erro', async () => {
      const errorMessage = 'Erro ao processar';
      repo.update.mockResolvedValue({ affected: 1 } as any);

      await repository.finishRunError(mockRun.id, errorMessage);

      expect(repo.update).toHaveBeenCalledWith(mockRun.id, {
        status: 'erro',
        errorMessage,
      });
    });
  });

  describe('findByCorrelationId', () => {
    it('deve encontrar runs por correlationId', async () => {
      const runs = [mockRun];
      repo.find.mockResolvedValue(runs);

      const result = await repository.findByCorrelationId('correlation-123');

      expect(repo.find).toHaveBeenCalledWith({
        where: { correlationId: 'correlation-123' },
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual(runs);
    });
  });
});


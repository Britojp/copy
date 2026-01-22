import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { AgentExecutionFilter } from './agent-execution.filter';
import { AgentExecutionError, ExternalServiceError } from '../../common/errors/AppError';

describe('AgentExecutionFilter', () => {
  let filter: AgentExecutionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AgentExecutionFilter();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/ai/buscador-data',
      method: 'POST',
      body: {
        input: 'test input',
        correlationId: 'corr-123',
      },
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      })),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as any;
  });

  it('deve ser definido', () => {
    expect(filter).toBeDefined();
  });

  describe('AgentExecutionError', () => {
    it('deve capturar AgentExecutionError corretamente', () => {
      const error = new AgentExecutionError('Erro na execução do agente');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Erro na execução do agente',
          code: 'AGENT_EXECUTION_ERROR',
          type: 'agent_execution',
          context: expect.objectContaining({
            agentType: 'buscador-data',
            correlationId: 'corr-123',
          }),
        }),
      );
    });
  });

  describe('ExternalServiceError', () => {
    it('deve capturar ExternalServiceError corretamente', () => {
      const error = new ExternalServiceError('Erro no serviço externo');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(502);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 502,
          message: 'Erro no serviço externo',
          code: 'EXTERNAL_SERVICE_ERROR',
          type: 'external_service',
        }),
      );
    });
  });

  it('deve extrair contexto corretamente de diferentes endpoints', () => {
    const error = new AgentExecutionError('Erro');

    const endpoints = [
      { url: '/ai/pipeline', expectedType: 'pipeline' },
      { url: '/ai/escritor-descricao', expectedType: 'escritor-descricao' },
      { url: '/ai/gerador-prompt-imagem-post', expectedType: 'gerador-prompt-imagem-post' },
    ];

    endpoints.forEach(({ url, expectedType }) => {
      mockRequest.url = url;
      mockResponse.json.mockClear();

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            agentType: expectedType,
          }),
        }),
      );
    });
  });

  it('deve incluir runId no contexto se presente no body', () => {
    const error = new AgentExecutionError('Erro');
    mockRequest.body.runId = 'run-123';

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          runId: 'run-123',
        }),
      }),
    );
  });
});






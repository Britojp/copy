import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';
import { AppError, ValidationError, AgentExecutionError } from '../errors/AppError';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test/path',
      method: 'POST',
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

  describe('AppError', () => {
    it('deve capturar ValidationError corretamente', () => {
      const error = new ValidationError('Erro de validação');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Erro de validação',
          code: 'VALIDATION_ERROR',
          path: '/test/path',
          method: 'POST',
        }),
      );
    });

    it('deve capturar AgentExecutionError corretamente', () => {
      const error = new AgentExecutionError('Erro na execução do agente');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Erro na execução do agente',
          code: 'AGENT_EXECUTION_ERROR',
        }),
      );
    });

    it('deve capturar AppError genérico corretamente', () => {
      const error = new AppError('Erro genérico', 'CUSTOM_ERROR', 418);

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(418);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 418,
          message: 'Erro genérico',
          code: 'CUSTOM_ERROR',
        }),
      );
    });
  });

  describe('HttpException', () => {
    it('deve capturar BadRequestException corretamente', () => {
      const error = new BadRequestException('Requisição inválida');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Requisição inválida',
          path: '/test/path',
          method: 'POST',
        }),
      );
    });

    it('deve tratar HttpException com resposta de objeto', () => {
      const error = new HttpException(
        { message: 'Erro customizado', field: 'campo' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Erro customizado',
        }),
      );
    });

    it('deve tratar HttpException com array de mensagens', () => {
      const error = new BadRequestException(['Erro 1', 'Erro 2']);

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: 'Erro 1, Erro 2',
          details: ['Erro 1', 'Erro 2'],
        }),
      );
    });
  });

  describe('Error genérico', () => {
    it('deve capturar Error padrão corretamente', () => {
      const error = new Error('Erro padrão');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Erro padrão',
          path: '/test/path',
          method: 'POST',
        }),
      );
    });

    it('deve tratar erro desconhecido corretamente', () => {
      const error = 'Erro como string';

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: 'Erro como string',
        }),
      );
    });
  });

  it('deve incluir timestamp no response', () => {
    const error = new ValidationError('Erro de validação');
    const beforeTime = new Date().toISOString();

    filter.catch(error, mockArgumentsHost);

    const callArg = mockResponse.json.mock.calls[0][0];
    expect(callArg.timestamp).toBeDefined();
    expect(new Date(callArg.timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(beforeTime).getTime(),
    );
  });
});






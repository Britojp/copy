import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost } from '@nestjs/common';
import { PromptValidationFilter } from './prompt-validation.filter';
import { ValidationError } from '../../common/errors/AppError';

describe('PromptValidationFilter', () => {
  let filter: PromptValidationFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new PromptValidationFilter();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/ai/buscador-data',
      method: 'POST',
      body: {
        input: 'test input',
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

  it('deve capturar ValidationError corretamente', () => {
    const error = new ValidationError('Erro de validação');

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        type: 'prompt_validation',
        validationType: 'input_invalid',
      }),
    );
  });

  it('deve detectar prompt injection corretamente', () => {
    const error = new ValidationError(
      'Input contém padrões suspeitos',
      'PROMPT_INJECTION_DETECTED',
    );

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        validationType: 'prompt_injection_detected',
        details: expect.objectContaining({
          detectedPattern: 'prompt_injection_pattern',
        }),
      }),
    );
  });

  it('deve detectar token limit exceeded corretamente', () => {
    const error = new ValidationError(
      'Input excede o limite de tokens',
      'TOKEN_LIMIT_EXCEEDED',
    );

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        validationType: 'token_limit_exceeded',
      }),
    );
  });

  it('deve extrair detalhes de comprimento do input', () => {
    const error = new ValidationError(
      'Input muito longo: máximo 5000 caracteres, recebido 6000',
    );

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        validationType: 'input_too_long',
        details: {
          maxLength: 5000,
          receivedLength: 6000,
        },
      }),
    );
  });

  it('deve detectar repetition attack corretamente', () => {
    const error = new ValidationError(
      'Ataque de repetição detectado',
      'REPETITION_ATTACK_DETECTED',
    );

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        validationType: 'repetition_attack_detected',
      }),
    );
  });

  it('deve detectar dangerous word corretamente', () => {
    const error = new ValidationError(
      'Palavra perigosa detectada',
      'DANGEROUS_WORD_DETECTED',
    );

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        validationType: 'dangerous_word_detected',
      }),
    );
  });
});






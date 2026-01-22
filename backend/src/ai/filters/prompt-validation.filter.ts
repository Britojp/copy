import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from '../../common/errors/AppError';

export interface PromptValidationErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code: string;
  type: 'prompt_validation';
  validationType?:
    | 'input_invalid'
    | 'prompt_injection_detected'
    | 'dangerous_word_detected'
    | 'repetition_attack_detected'
    | 'token_limit_exceeded'
    | 'input_too_long'
    | 'other';
  details?: {
    maxLength?: number;
    receivedLength?: number;
    maxTokens?: number;
    detectedPattern?: string;
  };
}

@Catch(ValidationError)
@Injectable()
export class PromptValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(PromptValidationFilter.name);

  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const validationType = this.detectValidationType(exception.code, exception.message);
    const details = this.extractDetails(exception);

    this.logger.warn(
      `Prompt Validation Error [${exception.code}]: ${exception.message}`,
      {
        path: request.url,
        method: request.method,
        validationType,
        details,
      },
    );

    const errorResponse: PromptValidationErrorResponse = {
      statusCode: exception.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      code: exception.code,
      type: 'prompt_validation',
      validationType,
      ...(details && Object.keys(details).length > 0 && { details }),
    };

    response.status(exception.status).json(errorResponse);
  }

  private detectValidationType(
    code: string,
    message?: string,
  ): PromptValidationErrorResponse['validationType'] {
    const msg = (message || '').toLowerCase();
    
    if (code === 'PROMPT_INJECTION_DETECTED') {
      return 'prompt_injection_detected';
    }
    if (code === 'DANGEROUS_WORD_DETECTED') {
      return 'dangerous_word_detected';
    }
    if (code === 'REPETITION_ATTACK_DETECTED') {
      return 'repetition_attack_detected';
    }
    if (code === 'TOKEN_LIMIT_EXCEEDED') {
      return 'token_limit_exceeded';
    }
    if (code.includes('LENGTH') || code.includes('LONGO') || msg.includes('muito longo')) {
      return 'input_too_long';
    }
    if (msg.includes('padrões suspeitos') || msg.includes('prompt injection')) {
      return 'prompt_injection_detected';
    }
    if (msg.includes('repetição') || msg.includes('repetition')) {
      return 'repetition_attack_detected';
    }
    if (msg.includes('perigosa') || msg.includes('dangerous')) {
      return 'dangerous_word_detected';
    }
    if (msg.includes('tokens') || msg.includes('token limit')) {
      return 'token_limit_exceeded';
    }
    if (code === 'VALIDATION_ERROR') {
      return 'input_invalid';
    }
    return 'other';
  }

  private extractDetails(
    exception: ValidationError,
  ): PromptValidationErrorResponse['details'] {
    const message = exception.message.toLowerCase();
    const details: PromptValidationErrorResponse['details'] = {};

    const lengthMatch = message.match(/máximo (\d+) caracteres, recebido (\d+)/);
    if (lengthMatch) {
      details.maxLength = parseInt(lengthMatch[1], 10);
      details.receivedLength = parseInt(lengthMatch[2], 10);
    }

    const tokenMatch = message.match(/(\d+) tokens/);
    if (tokenMatch) {
      details.maxTokens = parseInt(tokenMatch[1], 10);
    }

    if (message.includes('padrões suspeitos')) {
      details.detectedPattern = 'prompt_injection_pattern';
    }

    return Object.keys(details).length > 0 ? details : undefined;
  }
}


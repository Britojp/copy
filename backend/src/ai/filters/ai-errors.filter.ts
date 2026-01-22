import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AgentExecutionError, ExternalServiceError, ValidationError } from '../../common/errors/AppError';

export interface AIErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code: string;
  category: 'validation' | 'execution' | 'external_service' | 'unknown';
  aiContext?: {
    endpoint: string;
    hasInput: boolean;
    inputLength?: number;
  };
}

@Catch()
export class AIErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AIErrorsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (!this.isAIEndpoint(request.url)) {
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let code = 'AI_ERROR';
    let category: AIErrorResponse['category'] = 'unknown';

    if (exception instanceof ValidationError) {
      status = exception.status;
      message = exception.message;
      code = exception.code;
      category = 'validation';
    } else if (exception instanceof AgentExecutionError) {
      status = exception.status;
      message = exception.message;
      code = exception.code;
      category = 'execution';
    } else if (exception instanceof ExternalServiceError) {
      status = exception.status;
      message = exception.message;
      code = exception.code;
      category = 'external_service';
    } else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(
        `Unexpected AI Error: ${message}`,
        exception.stack,
        {
          path: request.url,
          method: request.method,
        },
      );
    }

    const errorResponse: AIErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      code,
      category,
      aiContext: this.extractAIContext(request),
    };

    response.status(status).json(errorResponse);
  }

  private isAIEndpoint(url: string): boolean {
    return (
      url.includes('/ai/buscador-data') ||
      url.includes('/ai/buscador-informacoes') ||
      url.includes('/ai/escritor-descricao') ||
      url.includes('/ai/gerador-prompt-imagem-post') ||
      url.includes('/ai/pipeline') ||
      url.includes('/ai/brand-profiles')
    );
  }

  private extractAIContext(request: Request): AIErrorResponse['aiContext'] {
    const context: AIErrorResponse['aiContext'] = {
      endpoint: request.url,
      hasInput: !!request.body?.input,
    };

    if (request.body?.input && typeof request.body.input === 'string') {
      context.inputLength = request.body.input.length;
    }

    return context;
  }
}






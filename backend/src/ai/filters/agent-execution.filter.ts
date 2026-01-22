import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AgentExecutionError, ExternalServiceError } from '../../common/errors/AppError';

export interface AgentErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code: string;
  type: 'agent_execution' | 'external_service';
  context?: {
    runId?: string;
    correlationId?: string;
    agentType?: string;
  };
}

@Catch(AgentExecutionError, ExternalServiceError)
@Injectable()
export class AgentExecutionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AgentExecutionFilter.name);

  catch(
    exception: AgentExecutionError | ExternalServiceError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const type =
      exception instanceof ExternalServiceError
        ? 'external_service'
        : 'agent_execution';

    this.logger.error(
      `Agent Error [${exception.code}]: ${exception.message}`,
      exception.stack,
      {
        path: request.url,
        method: request.method,
        body: request.body,
        type,
      },
    );

    const errorResponse: AgentErrorResponse = {
      statusCode: exception.status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      code: exception.code,
      type,
      context: this.extractContext(request),
    };

    response.status(exception.status).json(errorResponse);
  }

  private extractContext(request: Request): AgentErrorResponse['context'] {
    const context: AgentErrorResponse['context'] = {};

    if (request.body?.correlationId) {
      context.correlationId = request.body.correlationId;
    }

    if (request.body?.runId) {
      context.runId = request.body.runId;
    }

    if (request.body?.agentType) {
      context.agentType = request.body.agentType;
    }

    if (request.url?.includes('buscador-data')) {
      context.agentType = 'buscador-data';
    } else if (request.url?.includes('buscador-informacoes')) {
      context.agentType = 'buscador-informacoes';
    } else if (request.url?.includes('escritor-descricao')) {
      context.agentType = 'escritor-descricao';
    } else if (request.url?.includes('gerador-prompt-imagem-post')) {
      context.agentType = 'gerador-prompt-imagem-post';
    } else if (request.url?.includes('pipeline')) {
      context.agentType = 'pipeline';
    }

    return Object.keys(context).length > 0 ? context : undefined;
  }
}


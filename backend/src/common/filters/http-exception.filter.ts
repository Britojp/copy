import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code?: string;
  details?: unknown;
}

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let code: string | undefined;
    let details: unknown;

    if (exception instanceof AppError) {
      status = exception.status;
      message = exception.message;
      code = exception.code;
      this.logger.warn(
        `AppError: ${exception.code} - ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
          details = responseObj.message;
        } else {
          details = responseObj;
        }
      }
      
      this.logger.warn(
        `HttpException: ${status} - ${message}`,
        exception.stack,
      );
    } else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(
        `Unexpected error: ${message}`,
        exception.stack,
        request.url,
      );
    } else {
      message = String(exception) || message;
      this.logger.error(`Unknown error: ${message}`, request.url);
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    if (code) {
      errorResponse.code = code;
    }

    if (details) {
      errorResponse.details = details;
    }

    response.status(status).json(errorResponse);
  }
}


export class AppError extends Error {
  code: string;
  status: number;
  constructor(message: string, code = 'APP_ERROR', status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, code, 400);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, code = 'EXTERNAL_SERVICE_ERROR') {
    super(message, code, 502);
  }
}

export class AgentExecutionError extends AppError {
  constructor(message: string, code = 'AGENT_EXECUTION_ERROR') {
    super(message, code, 500);
  }
}



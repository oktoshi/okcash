// Custom error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class KnowledgeBaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KnowledgeBaseError';
  }
}

// Error handler
export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unknown error occurred');
}

// API error handler
export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }
  return new APIError('API request failed');
}
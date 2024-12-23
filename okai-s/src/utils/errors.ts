// Custom error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class APIError extends Error {
  constructor(
    message: string, 
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
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

// API error handler with improved type checking
export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }
  
  // Handle standard API error responses
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    if (status === 401) {
      return new APIError('Invalid API credentials. Please check your configuration.', 401);
    }
    return new APIError(`API request failed with status ${status}`, status);
  }
  
  return new APIError('API request failed');
}
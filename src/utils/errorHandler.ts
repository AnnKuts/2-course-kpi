import { ZodError, ZodIssue } from 'zod';

import { DomainError } from '../domain/errors/DomainError';
import { NotFoundError } from '../domain/errors/NotFoundError';

export function getErrorStatus(error: unknown): number {
  if (error instanceof NotFoundError) {
    return 404;
  }

  if (error instanceof DomainError) {
    return 400;
  }

  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'ZodError'
  ) {
    return 400;
  }

  return 500;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof NotFoundError) {
    return error.message;
  }
  if (error instanceof DomainError) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues
      .map((issue: ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Internal server error';
}

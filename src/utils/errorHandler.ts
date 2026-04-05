import { ZodError } from 'zod';

import { NotFoundError } from './httpErrors';

const formatZodError = (error: ZodError): string => {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : 'request';
      return `${field}: ${issue.message}`;
    })
    .join('; ');
};

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = 'An unknown error occurred',
): string => {
  if (error instanceof ZodError) {
    return formatZodError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

export const getErrorStatus = (error: unknown): number => {
  if (error instanceof ZodError) {
    return 400;
  }

  if (error instanceof NotFoundError) {
    return 404;
  }

  return 500;
};

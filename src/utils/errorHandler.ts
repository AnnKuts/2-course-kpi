import { ZodError } from 'zod';

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
  fallbackMessage = 'Сталася невідома помилка',
): string => {
  if (error instanceof ZodError) {
    return formatZodError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

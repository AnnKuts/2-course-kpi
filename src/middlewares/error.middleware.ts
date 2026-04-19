import { NextFunction, Request, Response } from 'express';

import { getErrorMessage, getErrorStatus } from '../utils/errorHandler';

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = getErrorStatus(err);
  const message = getErrorMessage(err);

  res.status(status).json({ message });
};

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', err);

  const statusCode = (err as any).status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ success: false, status: statusCode, message });
};

export default errorHandler;

import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten()
      });
    }
    req.body = parsed.data;
    next();
  };
};

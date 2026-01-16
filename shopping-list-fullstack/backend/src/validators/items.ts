import { z } from 'zod';

export const createItemBody = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name is required')
    .max(120, 'name is too long')
});

export const updateItemBody = z.object({
  bought: z.boolean()
});

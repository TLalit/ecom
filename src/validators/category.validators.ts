import { z } from "zod";

export const CreateCategorySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  rank: z.number(),
  imageId: z.string().min(1),
  description: z.string().nullable().optional(),
  parentCategoryId: z.string().nullable().optional(),
});

export const EditCategorySchema = CreateCategorySchema.merge(
  z.object({
    id: z.string(),
  }),
);

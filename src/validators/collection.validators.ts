import { StatusEnum, VisibilityEnum } from "@/constants";
import { z } from "zod";

export const CreateCollectionSchema = z.object({
  description: z.string().nullable().optional(),
  imageId: z.string(),
  slug: z.string(),
  status: z.enum([StatusEnum.ACTIVE, StatusEnum.INACTIVE]),
  title: z.string(),
  visibility: z.enum([VisibilityEnum.PUBLIC, VisibilityEnum.PRIVATE]),
});

export const EditCollectionSchema = CreateCollectionSchema.merge(
  z.object({
    id: z.string(),
  }),
);

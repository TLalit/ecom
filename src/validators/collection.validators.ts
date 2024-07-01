import { StatusEnum, VisibilityEnum } from "@/constants";
import { z } from "zod";

export const CreateCollectionSchema = z.object({
  description: z.string(),
  imageId: z.string(),
  slug: z.string(),
  status: z.enum([StatusEnum.ACTIVE, StatusEnum.INACTIVE]),
  title: z.string(),
  visibility: z.enum([VisibilityEnum.PUBLIC, VisibilityEnum.PRIVATE]),
});

export type CreateCollectionBody = z.infer<typeof CreateCollectionSchema>;
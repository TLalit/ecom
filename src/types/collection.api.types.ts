import { z } from "zod";

export enum StatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum VisibilityEnum {
  PUBLIC = "public",
  PRIVATE = "private",
}
export const PostCollectionRequestValidator = z.object({
  description: z.string(),
  imageId: z.string(),
  slug: z.string(),
  status: z.enum([StatusEnum.ACTIVE, StatusEnum.INACTIVE]),
  title: z.string(),
  visibility: z.enum([VisibilityEnum.PUBLIC, VisibilityEnum.PRIVATE]),
});

export type PostCollectionRequest = z.infer<
  typeof PostCollectionRequestValidator
>;

export interface PostCollectionResponse {
  id: string;
}

export interface GetCollectionResponse {
  collections: {
    id: string;
    title: string;
    description: string | null;
    image: {
      id: string;
      url: string;
      thumbnailUrl: string;
    } | null;
    slug: string;
    status: StatusEnum;
    visibility: VisibilityEnum;
  }[];
  page: number;
  limit: number;
  total: number;
}

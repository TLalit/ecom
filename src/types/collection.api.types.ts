export enum StatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum VisibilityEnum {
  PUBLIC = "public",
  PRIVATE = "private",
}

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

import { StatusEnum, VisibilityEnum } from "@/types/collection.api.types";
import { Nullable } from "@/types/generic.api.types";

export interface ICollection {
  id: string;
  title: string;
  description: Nullable<string>;
  image: Nullable<{
    id: string;
    url: string;
    thumbnailUrl: string;
  }>;
  slug: string;
  status: StatusEnum;
  visibility: VisibilityEnum;
}

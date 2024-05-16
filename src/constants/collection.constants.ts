import { StatusEnum, VisibilityEnum } from "@/types/collection.api.types";

export const collectionStatus = [
  { label: "Active", value: StatusEnum.ACTIVE },
  { label: "Inactive", value: StatusEnum.INACTIVE },
];
export const visibilityStatus = [
  {
    label: "Public",
    value: VisibilityEnum.PUBLIC,
  },
  {
    label: "Private",
    value: VisibilityEnum.PRIVATE,
  },
];

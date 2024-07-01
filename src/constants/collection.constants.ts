export enum StatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum VisibilityEnum {
  PUBLIC = "public",
  PRIVATE = "private",
}
export const collectionStatusOptions = [
  { label: "Active", value: StatusEnum.ACTIVE },
  { label: "Inactive", value: StatusEnum.INACTIVE },
];
export const visibilityStatusOptions = [
  {
    label: "Public",
    value: VisibilityEnum.PUBLIC,
  },
  {
    label: "Private",
    value: VisibilityEnum.PRIVATE,
  },
];

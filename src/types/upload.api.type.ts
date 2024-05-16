const AssetType = {
  IMAGE: "image",
  VIDEO: "video",
} as const;

const EntityType = {
  COLLECTION: "collection",
} as const;

export interface PostUploadRequest {
  file: File;
  assetType: (typeof AssetType)[keyof typeof AssetType];
  entityType: (typeof EntityType)[keyof typeof EntityType];
}
export interface PostUploadResponse {
  id: string;
  url: string;
  thumbnailUrl: string;
}

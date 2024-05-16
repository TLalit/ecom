import { S3_URL, THUMBNAIL_PREFIX } from "@/constants";

export const generateSlug = (input: string) => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const sentenceCase = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const addThumbnailPrefix = (url: string) => {
  return `${THUMBNAIL_PREFIX}${url}`;
};
export const createThumbnailUrl = (url: string) => {
  return `${S3_URL}/${addThumbnailPrefix(url)}`;
};

export const createMainUrl = (url: string) => {
  return `${S3_URL}/${url}`;
};

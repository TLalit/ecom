import { errorHandler } from "@/lib/query.helper";
import { PostUploadRequest, PostUploadResponse } from "@/types/upload.api.type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useFileUploadMutation = () =>
  useMutation({
    onError: errorHandler(),
    mutationFn: async ({ file, assetType, entityType }: PostUploadRequest) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", assetType);
      formData.append("entityType", entityType);
      const res = await axios.post<PostUploadResponse>("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
  });

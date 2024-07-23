import { cn } from "@/lib/utils";
import clsx from "clsx";
import { forwardRef, HTMLAttributes, useCallback } from "react";
import { DropEvent, DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import { LucideIcon } from "../icons/icon";
import { Card, CardContent, CardHeader } from "../ui/card";

interface Props
  extends Omit<DropzoneOptions, "onDrop">,
    Pick<HTMLAttributes<HTMLInputElement>, "className" | "onBlur"> {
  onChange?: (
    acceptedFiles: { file?: File; url: string }[],
    rejectedFiles: {
      file: File;
      url: string;
      errors: FileRejection["errors"];
    }[],
    event: DropEvent,
  ) => void;
  onBlur?: () => void;
  value?: { file?: File; url: string }[];
  name?: string;
  disabled?: boolean;
  hideOnSelect?: boolean;
  keepPreviousOnSelect?: boolean;
}
const AcceptValues = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
  "video/*": [".mp4", ".webm"],
  "audio/*": [".mp3", ".wav"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc", ".docx"],
  "application/vnd.ms-excel": [".xls", ".xlsx"],
  "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
  "application/x-tar": [".tar"],
  "application/x-7z-compressed": [".7z"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

export const FileUploader = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      multiple = false,
      accept = {
        "image/*": AcceptValues["image/*"],
      },
      onChange,
      name,
      disabled,
      value = [],
      onBlur,
      hideOnSelect = false,
      keepPreviousOnSelect = false,
      ...dropZoneProps
    },
    ref,
  ) => {
    const onDrop: Exclude<DropzoneOptions["onDrop"], undefined> = useCallback(
      (acceptedFiles: File[], rejectedFiles, event) => {
        const files = acceptedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        const filesWithErrors = rejectedFiles.map(({ file, errors }) => ({
          file,
          url: URL.createObjectURL(file),
          errors,
        }));
        const finalFiles = keepPreviousOnSelect ? [...value, ...files] : files;
        onChange?.(finalFiles, filesWithErrors, event);
      },
      [keepPreviousOnSelect, onChange, value],
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      multiple,
      ...dropZoneProps,
    });
    if (value.length > 0 && hideOnSelect) {
      return null;
    }
    return (
      <Card className={cn("flex flex-col overflow-hidden border-dashed", className)}>
        <CardContent
          {...getRootProps()}
          className={clsx("flex flex-1 flex-col items-center justify-center gap-2", {
            "bg-accent": isDragActive,
          })}
        >
          <CardHeader>
            <LucideIcon
              name="FileImage"
              className={clsx("h-10 w-10 text-gray-500", {
                "text-primary": isDragActive,
              })}
            />
          </CardHeader>
          <input
            {...getInputProps({
              ref,
              name,
              onBlur,
              disabled,
            })}
          />
          {isDragActive ? (
            <p className="text-center">Drop Here</p>
          ) : (
            <p className="text-center">Drag Files to Upload or Click Here</p>
          )}
        </CardContent>
      </Card>
    );
  },
);
FileUploader.displayName = "FileUploader";

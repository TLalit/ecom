import {
  GetCollectionActionResponse,
  createCollectionAction,
  editCollectionAction,
} from "@/actions/collection.actions";
import { FileUploader } from "@/components/global/file-upload";
import { ImageList } from "@/components/global/image-preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { collectionStatusOptions, visibilityStatusOptions } from "@/constants";
import { useFileUploadMutation } from "@/hooks/apiHooks";
import { errorHandler } from "@/lib/query.helper";
import { generateSlug } from "@/lib/string.helper";
import { StatusEnum } from "@/types/collection.api.types";
import { CreateCollectionSchema } from "@/validators/collection.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCollectionClientSchema = CreateCollectionSchema.omit({
  imageId: true,
}).merge(
  z.object({
    image: z
      .array(
        z.object({
          url: z.string().url(),
          file: z.any(),
          id: z.string().nullish(),
        }),
      )
      .min(1, "Please upload at least one image"),
  }),
);

export const CreateUpdateCollectionSheet = ({
  children,
  mode,
  row,
}: PropsWithChildren<{
  mode: "Create" | "Edit";
  row?: GetCollectionActionResponse["collections"][0];
}>) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createCollectionClientSchema>>({
    defaultValues: {
      description: row?.description ?? null,
      image: row?.image ? [row?.image] : [],
      slug: row?.slug,
      status: row?.status ?? StatusEnum.ACTIVE,
      title: row?.title,
      visibility: row?.visibility,
    },
    resolver: zodResolver(createCollectionClientSchema),
  });
  const onOpenChange = (value?: boolean) => {
    form.reset();
    setOpen((p) => value ?? !p);
  };
  const fileUploadMutation = useFileUploadMutation();
  const createCollectionMutation = useMutation({
    onError: errorHandler(),
    mutationFn: createCollectionAction,
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Collection created successfully");
      queryClient.refetchQueries({
        queryKey: ["getCollectionAction"],
      });
    },
  });
  const editCollectionMutation = useMutation({
    onError: errorHandler(),
    mutationFn: editCollectionAction,
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Collection created successfully");
      queryClient.refetchQueries({
        queryKey: ["getCollectionAction"],
      });
    },
  });
  const onSubmit = form.handleSubmit(async ({ image, ...data }) => {
    let imageId = image[0].id ?? "";
    if (image[0]?.file) {
      const { id } = await fileUploadMutation.mutateAsync({
        file: image[0]?.file,
        assetType: "image",
        entityType: "collection",
      });
      imageId = id;
    }
    if (mode === "Create") {
      await createCollectionMutation.mutateAsync({
        ...data,
        imageId,
      });
      return;
    }
    if (mode === "Edit" && row) {
      await editCollectionMutation.mutateAsync({
        ...data,
        imageId,
        id: row.id,
      });
      return;
    }
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children}
      <Form {...form}>
        <SheetContent className="flex">
          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
            <SheetHeader>
              <SheetTitle>{mode} Collection</SheetTitle>
            </SheetHeader>
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue("slug", generateSlug(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {collectionStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Visibility</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {visibilityStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const previewFiles = (field.value ?? [])?.map(({ url }) => ({
                  src: url,
                  width: 240,
                  height: 240,
                  className: "aspect-square",
                }));
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="flex gap-5">
                        <FileUploader {...field} className="size-60" hideOnSelect />
                        <ImageList
                          images={previewFiles}
                          onRemove={({ src }) => {
                            field.onChange(field.value.filter((item) => item.url !== src));
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <SheetFooter className="gap-5">
              <Button onClick={() => onOpenChange(false)} type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
              <LoadingButton type="submit" className="flex-1" loading={form.formState.isSubmitting}>
                {mode}
              </LoadingButton>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
};

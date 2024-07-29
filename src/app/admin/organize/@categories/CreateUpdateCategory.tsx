import { GetCategoriesActionResponse, createCategoryAction, editCategoryAction } from "@/actions/category.actions";
import { FileUploader } from "@/components/global/file-upload";
import { ImageList } from "@/components/global/image-preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useFileUploadMutation } from "@/hooks/apiHooks";
import { errorHandler } from "@/lib/query.helper";
import { generateSlug } from "@/lib/string.helper";
import { CreateCategorySchema } from "@/validators/category.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCategoryClientSchema = CreateCategorySchema.omit({
  imageId: true,
  parentCategoryId: true,
  rank: true,
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

export const CreateUpdateCategorySheet = ({
  children,
  mode,
  row,
}: PropsWithChildren<{
  mode: "Create" | "Edit";
  row?: GetCategoriesActionResponse["categories"][0];
}>) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createCategoryClientSchema>>({
    defaultValues:
      mode === "Create"
        ? {
            description: "",
            image: [],
            slug: "",
            title: "",
          }
        : {
            description: row?.description ?? null,
            image: row?.image ? [row?.image] : [],
            slug: row?.slug,
            title: row?.title,
          },
    resolver: zodResolver(createCategoryClientSchema),
  });
  const onOpenChange = (value?: boolean) => {
    form.reset();
    setOpen((p) => value ?? !p);
  };
  const fileUploadMutation = useFileUploadMutation();
  const createCategoryMutation = useMutation({
    onError: errorHandler(),
    mutationFn: createCategoryAction,
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Category created successfully");
      queryClient.refetchQueries({
        queryKey: ["getAllCategoriesAction"],
      });
    },
  });
  const editCategoryMutation = useMutation({
    onError: errorHandler(),
    mutationFn: editCategoryAction,
    onSuccess: () => {
      onOpenChange(false);
      toast.success("Category created successfully");
      queryClient.refetchQueries({
        queryKey: ["getAllCategoriesAction"],
      });
    },
  });
  const onSubmit = form.handleSubmit(async (data) => {
    let imageId = data.image[0].id ?? "";
    if (data.image[0]?.file) {
      const { id } = await fileUploadMutation.mutateAsync({
        file: data.image[0]?.file,
        assetType: "image",
        entityType: "collection",
      });
      imageId = id;
    }
    if (mode === "Create") {
      await createCategoryMutation.mutateAsync({
        slug: data.slug,
        title: data.title,
        description: data.description,
        imageId,
        rank: 0,
        parentCategoryId: row?.id ?? null,
      });
      return;
    }
    // if (mode === "Edit" && row) {
    //   await editCategoryMutation.mutateAsync({
    //     ...data,
    //     imageId,
    //     id: row.id,
    //   });
    //   return;
    // }
  }, console.log);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children}
      <Form {...form}>
        <SheetContent className="flex">
          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
            <SheetHeader>
              <SheetTitle>{mode} Category</SheetTitle>
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

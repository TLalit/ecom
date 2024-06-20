"use client";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { FileUploader } from "@/components/global/file-upload";
import { ImageList } from "@/components/global/image-preview";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { collectionStatus, visibilityStatus } from "@/constants";
import { useFileUploadMutation } from "@/hooks/apiHooks";
import { errorHandler } from "@/lib/query.helper";
import { generateSlug } from "@/lib/string.helper";
import {
  GetCollectionResponse,
  PostCollectionRequest,
  PostCollectionRequestValidator,
  PostCollectionResponse,
  StatusEnum,
  VisibilityEnum,
} from "@/types/collection.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const columns: DataTableProps<
  GetCollectionResponse["collections"][0]
>["columns"] = [
  { header: "Title", accessorKey: "title", enableSorting: true },
  {
    header: "Slug",
    accessorKey: "slug",
    enableSorting: true,
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Visibility",
    accessorKey: "visibility",
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => {
      return row.original.image ? (
        <ImageList
          images={[
            {
              src: row.original.image.thumbnailUrl,
              width: 40,
              height: 40,
              className: "aspect-square",
            },
          ]}
        />
      ) : null;
    },
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2">
            <LucideIcon name="EllipsisVertical" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <LucideIcon name="PenLine" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcon name="SquarePlus" />
              <span>Add Products</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcon name="Eye" />
              <span>View Products</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcon name="Info" />
              <span>Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <LucideIcon name="Trash" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
export default function Page() {
  const { data, isFetching } = useQuery({
    queryKey: ["/api/admin/collection"],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append("page", "0");
      return axios
        .get<GetCollectionResponse>(
          "/api/admin/collection?" + searchParams.toString(),
        )
        .then((res) => res.data);
    },
  });
  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background">
      <section className="relative flex items-center justify-between gap-5">
        <h1 className="text-2xl font-bold">Collection</h1>
        <CreateUpdateCollectionSheet mode="create">
          <Button>
            <LucideIcon name="Plus" />
            <span>Add</span>
          </Button>
        </CreateUpdateCollectionSheet>
      </section>
      <DataTable
        loading={isFetching}
        columns={columns}
        data={data?.collections}
      />
    </main>
  );
}

const createCollectionSchema = PostCollectionRequestValidator.omit({
  imageId: true,
}).merge(
  z.object({
    image: z
      .array(z.object({ url: z.string().url(), file: z.any() }))
      .min(1, "Please upload at least one image"),
  }),
);

const CreateUpdateCollectionSheet = ({
  children,
}: PropsWithChildren<{
  mode: "create" | "edit";
}>) => {
  const queryClient = useQueryClient();
  const [open, onOpenChange] = useState(false);
  const form = useForm<z.infer<typeof createCollectionSchema>>({
    defaultValues: {
      status: StatusEnum.ACTIVE,
      visibility: VisibilityEnum.PUBLIC,
      image: [],
    },
    resolver: zodResolver(createCollectionSchema),
  });
  const fileUploadMutation = useFileUploadMutation();
  const createCollectionMutation = useMutation({
    onError: errorHandler(),
    mutationFn: async (data: PostCollectionRequest) =>
      axios.post<PostCollectionResponse>("/api/admin/collection", data),
    onSuccess: () => {
      form.reset();
      onOpenChange(false);
      toast.success("Collection created successfully");
      queryClient.refetchQueries({
        queryKey: ["/api/admin/collection"],
      });
    },
  });
  const onSubmit = form.handleSubmit(async ({ image, ...data }) => {
    const { id } = await fileUploadMutation.mutateAsync({
      file: image[0].file,
      assetType: "image",
      entityType: "collection",
    });
    await createCollectionMutation.mutateAsync({
      ...data,
      imageId: id,
    });
  });
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <Form {...form}>
        <SheetContent className="flex">
          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
            <SheetHeader>
              <SheetTitle>Create Collection</SheetTitle>
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
                          {collectionStatus.map((status) => (
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
                          {visibilityStatus.map((status) => (
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
                        <FileUploader
                          {...field}
                          className="size-60"
                          hideOnSelect
                        />
                        <ImageList
                          images={previewFiles}
                          onRemove={({ src }) => {
                            field.onChange(
                              field.value.filter((item) => item.url !== src),
                            );
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
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                className="flex-1"
                loading={form.formState.isSubmitting}
              >
                Create
              </LoadingButton>
            </SheetFooter>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
};

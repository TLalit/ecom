import {
  GetCategoriesActionResponse,
  deleteCategoryByIdAction,
  getAllCategoriesAction,
} from "@/actions/category.actions";
import { confirmBeforeAction } from "@/components/global/confirmation-dialog";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { ImageList } from "@/components/global/image-preview";
import { LucideIcon } from "@/components/icons/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetTrigger } from "@/components/ui/sheet";
import { errorHandler } from "@/lib/query.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { CreateUpdateCategorySheet } from "./CreateUpdateCategory";
const columns: DataTableProps<GetCategoriesActionResponse["categories"][0]>["columns"] = [
  {
    header: "Rank",
    accessorKey: "rank",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <LucideIcon name="GripVertical" className="text-gray-500" />
        {row.original.rank}
      </div>
    ),
  },
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
    cell: ({ row }) => {
      return <ActionsDropdown row={row} />;
    },
  },
];
const ActionsDropdown = ({ row }: { row: Row<GetCategoriesActionResponse["categories"][0]> }) => {
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: deleteCategoryByIdAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getAllCategoriesAction"],
      });
    },
    onError: () => {
      errorHandler();
    },
  });

  return (
    <CreateUpdateCategorySheet mode="Edit" row={row.original}>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <LucideIcon name="EllipsisVertical" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <SheetTrigger asChild>
            <DropdownMenuItem>
              <LucideIcon name="PenLine" />
              <span>Edit</span>
            </DropdownMenuItem>
          </SheetTrigger>
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
          <DropdownMenuItem
            destructive
            onClick={() => confirmBeforeAction(() => deleteCategory.mutateAsync({ id: row.original.id }))}
          >
            <LucideIcon name="Trash" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreateUpdateCategorySheet>
  );
};
export const CategoryTable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["getAllCategoriesAction"],
    queryFn: async () => getAllCategoriesAction(),
  });
  return <DataTable loading={isFetching} columns={columns} data={data?.categories} />;
};

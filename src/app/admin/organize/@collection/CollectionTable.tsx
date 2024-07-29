import {
  GetCollectionActionResponse,
  deleteCollectionByIdAction,
  getCollectionAction,
} from "@/actions/collection.actions";
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
import { CreateUpdateCollectionSheet } from "./CreateUpdateCollection";
const columns: DataTableProps<GetCollectionActionResponse["collections"][0]>["columns"] = [
  { header: "Title", accessorKey: "title", enableSorting: true },
  {
    header: "Slug",
    accessorKey: "slug",
    enableSorting: true,
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
const ActionsDropdown = ({ row }: { row: Row<GetCollectionActionResponse["collections"][0]> }) => {
  const queryClient = useQueryClient();

  const deleteCollection = useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: deleteCollectionByIdAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCollectionAction"],
      });
    },
    onError: () => {
      console.log("deleteCollectionError");
      errorHandler();
    },
  });

  return (
    <CreateUpdateCollectionSheet mode="Edit" row={row.original}>
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
            onClick={() => confirmBeforeAction(() => deleteCollection.mutateAsync({ id: row.original.id }))}
          >
            <LucideIcon name="Trash" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreateUpdateCollectionSheet>
  );
};
export const CollectionTable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["getCollectionAction"],
    queryFn: async () => getCollectionAction(),
  });
  return <DataTable loading={isFetching} columns={columns} data={data?.collections} />;
};

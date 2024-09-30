"use client";
import { getAllProduct } from "@/actions/product.actions";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { useQuery } from "@tanstack/react-query";
const columns: DataTableProps<Awaited<ReturnType<typeof getAllProduct>>[number]>["columns"] = [
  { header: "Title", accessorKey: "product.title", enableSorting: true },
  {
    header: "Slug",
    accessorKey: "product.slug",
    enableSorting: true,
  },
];
// const ActionsDropdown = ({ row }: { row: Row<ProductActions.GetAllResponse[number]> }) => {
//   const queryClient = useQueryClient();

//   const deleteCollection = useMutation({
//     mutationKey: ["deleteCollection"],
//     mutationFn: deleteCollectionByIdAction,
//     onSuccess: () => {
//       queryClient.refetchQueries({
//         queryKey: ["getCollectionAction"],
//       });
//     },
//     onError: errorHandler(),
//   });

//   return (
//     <CreateUpdateProductSheet mode="Update" row={row.original}>
//       <DropdownMenu>
//         <DropdownMenuTrigger className="p-2">
//           <LucideIcon name="EllipsisVertical" />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <SheetTrigger asChild>
//             <DropdownMenuItem>
//               <LucideIcon name="PenLine" />
//               <span>Edit</span>
//             </DropdownMenuItem>
//           </SheetTrigger>
//           <DropdownMenuItem>
//             <LucideIcon name="SquarePlus" />
//             <span>Add Products</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <LucideIcon name="Eye" />
//             <span>View Products</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <LucideIcon name="Info" />
//             <span>Details</span>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             destructive
//             onClick={() => confirmBeforeAction(() => deleteCollection.mutateAsync({ id: row.original.id }))}
//           >
//             <LucideIcon name="Trash" />
//             <span>Delete</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </CreateUpdateProductSheet>
//   );
// };
export const ProductTable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["getAllProduct"],
    queryFn: async () => getAllProduct(),
  });
  return <DataTable loading={isFetching} columns={columns} data={data} />;
};

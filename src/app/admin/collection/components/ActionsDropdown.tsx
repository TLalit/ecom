import { deleteCollectionByIdAction } from "@/actions/collection.actions";
import { confirmBeforeAction } from "@/components/global/confirmation-dialog";
import { LucideIcon } from "@/components/icons/icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusEnum, VisibilityEnum } from "@/constants";
import { errorHandler } from "@/lib/query.helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

interface IRow {
    id: string;
    title: string;
    description: string | null;
    image: {
        id: string;
        url: string;
        thumbnailUrl: string;
    } | null;
    slug: string;
    status: StatusEnum;
    visibility: VisibilityEnum;
}
export const ActionsDropdown = ({ row }: { row: Row<IRow> }) => {
    const queryClient = useQueryClient()

    const deleteCollection = useMutation({
        mutationKey: ['deleteCollection'],
        mutationFn: deleteCollectionByIdAction,
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["getCollectionAction"],
            })
        },
        onError: () => { console.log("deleteCollectionError"); errorHandler() },
    })

    return <>
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
                <DropdownMenuItem
                    destructive
                    onClick={() => confirmBeforeAction(
                        () => deleteCollection.mutateAsync({ id: row.id }),
                    )}
                >
                    <LucideIcon name="Trash" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>

}


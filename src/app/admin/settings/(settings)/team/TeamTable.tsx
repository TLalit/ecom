"use client";
import { deleteTeamMemberAction, getTeamAction, GetTeamActionResponse } from "@/actions/user.actions";
import { confirmBeforeAction } from "@/components/global/confirmation-dialog";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { LucideIcon } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetTrigger } from "@/components/ui/sheet";
import { RoleLabel, UserRoles } from "@/types/db.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateUpdateTeam } from "./CreateUpdateTeam";

const ActionsDropdown = ({ row }: { row: Row<GetTeamActionResponse["team"][0]> }) => {
  const queryClient = useQueryClient();
  const deleteTeamMember = useMutation({
    mutationKey: ["deleteTeamMember"],
    mutationFn: deleteTeamMemberAction,
    onSuccess: () => {
      toast.success("Team member deleted");
      queryClient.refetchQueries({
        queryKey: ["getTeamAction"],
      });
    },
  });
  return (
    <CreateUpdateTeam mode="Edit" row={row.original}>
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

          <DropdownMenuSeparator />
          <DropdownMenuItem
            destructive
            onClick={() => confirmBeforeAction(() => deleteTeamMember.mutateAsync(row.original.id))}
          >
            <LucideIcon name="Trash" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreateUpdateTeam>
  );
};
const columns: DataTableProps<GetTeamActionResponse["team"][0]>["columns"] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.roles.map((role) => (
            <Badge variant={role === UserRoles.restricted ? "destructive" : "secondary"} key={role}>
              {RoleLabel[role]}
            </Badge>
          ))}
        </div>
      );
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
export const TeamTable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["getTeamAction"],
    queryFn: async () => getTeamAction(),
  });
  return <DataTable loading={isFetching} columns={columns} data={data?.team} />;
};

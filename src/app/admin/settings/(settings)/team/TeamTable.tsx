"use client";
import { getTeamAction, GetTeamActionResponse } from "@/actions/user.actions";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { useQuery } from "@tanstack/react-query";
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
  },
];
export const TeamTable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["getTeamAction"],
    queryFn: async () => getTeamAction(),
  });
  return <DataTable loading={isFetching} columns={columns} data={data?.team} />;
};

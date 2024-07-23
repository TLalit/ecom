"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useCallback, useEffect, useMemo } from "react";
import { LucideIcon } from "../icons/icon";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export interface ActionBarProps<TData> {
  selectedRows: TData[];
}

export interface DataTableProps<TData, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  loading?: boolean;
  multiRowSelection?: boolean;
  rowSelectionKey?: string;
  searchKey?: string;
}

interface DataTableState {
  id: string;
  className?: string;
}

export function DataTable<TData extends DataTableState, TValue>({
  columns,
  data = [],
  loading = false,
  multiRowSelection = false,
  rowSelectionKey = "selectedRowIds",
  searchKey = "search",
}: DataTableProps<TData, TValue>) {
  const { searchParams, setSearchParams } = useQueryParams();
  const searchValue = useMemo(() => searchParams?.get(searchKey) ?? "", [searchKey, searchParams]);

  const sorting: SortingState = useMemo(
    () => [
      {
        desc: searchParams?.get("sort-order") === "desc",
        id: searchParams?.get("sort-by") as string,
      },
    ],
    [searchParams],
  );
  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (sortingState) => {
      let finalState: Record<string, string> = {};
      if (typeof sortingState !== "function") {
        finalState = {
          "sort-by": sorting?.[0].id,
          "sort-order": sorting?.[0].desc ? "desc" : "asc",
        };

        return;
      }
      if (typeof sortingState === "function") {
        const newSortingState = sortingState(sorting);
        finalState = {
          "sort-by": newSortingState?.[0].id,
          "sort-order": newSortingState?.[0].desc ? "desc" : "asc",
        };
      }
      setSearchParams(finalState, { replace: true });
    },
    [setSearchParams, sorting],
  );
  const rowSelection: RowSelectionState = useMemo(() => {
    const newState = searchParams
      ?.get(rowSelectionKey)
      ?.split(",")
      ?.reduce(
        (acc, key) => {
          if (key === "") return acc;
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    return newState ?? {};
  }, [searchParams, rowSelectionKey]);

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (rowSelectionState) => {
      let finalState: Record<string, string> = {
        [rowSelectionKey]: "",
      };
      if (typeof rowSelectionState !== "function") {
        finalState = {
          [rowSelectionKey]: Object.keys(rowSelection).join(","),
        };

        return;
      }

      if (typeof rowSelectionState === "function") {
        const newSortingState = rowSelectionState(multiRowSelection ? rowSelection : {});
        finalState = {
          [rowSelectionKey]: Object.keys(newSortingState).join(","),
        };
      }
      setSearchParams(finalState, { replace: true });
    },
    [multiRowSelection, rowSelection, setSearchParams, rowSelectionKey],
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: onRowSelectionChange,
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageSize: data.length,
        pageIndex: 0,
      },
    },
  });
  const { setGlobalFilter } = table;
  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue, setGlobalFilter, table]);

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { enableSorting, size } = header.column.columnDef;
                const context = header.getContext();
                const isSortingAsc = context.column.getIsSorted() === "asc";
                return (
                  <TableHead key={header.id} className="px-2">
                    <div className="flex items-center justify-between gap-2">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, context)}
                      {enableSorting && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-6"
                          onClick={() => context.column.toggleSorting(isSortingAsc)}
                        >
                          <LucideIcon
                            name="ChevronDown"
                            className={clsx("size-2 transition-transform", {
                              "rotate-180": isSortingAsc,
                            })}
                          />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(1)
              .fill(null)
              .map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={columns.length} className="text-left text-gray-500">
                    <Progress />
                  </TableCell>
                </TableRow>
              ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer"
                // onClick={() => row.toggleSelected()}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("min-h-20", {
                      "w-full": cell.column.columnDef.size === 100,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-left text-gray-500">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

"use client";
import {
  createAvailableCurrencyAction,
  deleteAvailableCurrencyAction,
  editAvailableCurrencyActions,
  getCurrencyAction,
  GetCurrencyActionResponse,
  updateDefaultCurrencyAction,
} from "@/actions/currency.actions";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { LucideIcon } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { errorHandler } from "@/lib/query.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const { data, isFetching } = useQuery({
    queryKey: ["getCurrencies"],
    queryFn: async () => getCurrencyAction(),
    select(data) {
      const availableCurrency = data?.currencies?.filter((curr) => curr.isAvailable);
      const unAvailableCurrency = data?.currencies?.filter((curr) => !curr.isAvailable);

      return {
        availableCurrency,
        unAvailableCurrency,
        total: data.total,
      };
    },
  });

  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="relative flex justify-between gap-4">
        <h1 className="flex-1 text-2xl font-bold">Currencies</h1>
        <div className="actions flex gap-4">
          <DefaultCurrency availableCurrencies={data?.availableCurrency ?? []} />

          <AddCurrencySheet currencies={data?.unAvailableCurrency ?? []}>
            <SheetTrigger asChild>
              <Button>
                <LucideIcon name="Plus" />
                <span>Add </span>
              </Button>
            </SheetTrigger>
          </AddCurrencySheet>
        </div>
      </section>
      <DataTable loading={isFetching} columns={availableCurrencyColumns} data={data?.availableCurrency} />
    </main>
  );
}

const formatCurrency = (currency: number, mode?: "client") => {
  if (mode && mode === "client") {
    return currency / 100;
  } else return currency * 100;
};

const AddCurrencySheet = ({
  children,
  currencies,
}: PropsWithChildren<{
  currencies: GetCurrencyActionResponse["currencies"][0][];
}>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const onOpenChange = () => {
    form.reset();
    setSearchTerm("");
    setOpen((prev) => !prev);
  };
  const addCurrencyHandler = useMutation({
    mutationKey: ["addCurrencyHandler"],
    mutationFn: createAvailableCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
      onOpenChange();
    },
    onError: errorHandler(),
  });
  const form = useForm();
  const onSubmit = form.handleSubmit(async (data) => {
    const definedCurr: [string, number][] = Object.entries(data).filter((curr) => curr[1]);
    const availableCurrencies = definedCurr.reduce(
      (acc, curr) => {
        const tempCurr = {
          currencyId: curr[0],
          value: formatCurrency(Number(curr[1])),
        };
        acc.push(tempCurr);
        return acc;
      },
      [] as { currencyId: string; value: number }[],
    );
    addCurrencyHandler.mutate({ availableCurrencies });
  });

  const handleForm = (id: string, value: number) => {
    form.setValue(id, value);
  };
  const filteredCurrencies = currencies.filter((curr) => curr.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <Form {...form}>
        <SheetContent>
          <form onSubmit={onSubmit} className="flex h-full flex-1 flex-col gap-5">
            <SheetHeader>
              <SheetTitle> Add Store Currencies</SheetTitle>
            </SheetHeader>
            <Input placeholder="Search currencies..." onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {filteredCurrencies.slice(0, 100).map((curr, idx) => {
                  return (
                    <div key={idx} className="flex items-center justify-start gap-2">
                      <AddEditValueDialog currencyId={curr.id} mode={"Add"} handleAddSubmit={handleForm}>
                        <DialogTrigger asChild>
                          <Checkbox
                            label={`${curr.name} (${curr.symbol}) `}
                            checked={!!form.watch(curr.id)}
                            name={curr.id}
                          />
                        </DialogTrigger>
                      </AddEditValueDialog>
                      <FormMessage />
                    </div>
                  );
                })}
              </div>
            </div>

            {!!currencies.length ? (
              <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                Add
              </LoadingButton>
            ) : (
              <div>No currencies to add</div>
            )}
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
};

const availableCurrencyColumns: DataTableProps<GetCurrencyActionResponse["currencies"][0]>["columns"] = [
  {
    header: "Default Value",
    accessorKey: "value",
    cell: ({ row }) => {
      return <div className="">1 USD</div>;
    },
  },
  {
    header: "Current Value",
    accessorKey: "code",
    accessorFn: (row) => {
      return `${formatCurrency(row.value, "client")} ${row.code.toUpperCase()}`;
    },
  },

  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span>{row.original.name}</span>
          {row.original.isDefault && <Badge variant={"secondary"}>Default</Badge>}
        </div>
      );
    },
  },

  {
    header: "Actions",
    accessorKey: "id",
    cell({ row }) {
      return <ActionsDropdown row={row} />;
    },
  },
];

const ActionsDropdown = ({ row }: { row: Row<GetCurrencyActionResponse["currencies"][0]> }) => {
  const queryClient = useQueryClient();
  const deleteAvailableCurrencies = useMutation({
    mutationKey: ["deleteAvailableCurrencies"],
    mutationFn: deleteAvailableCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: errorHandler(),
  });
  const editAvailableCurrencies = useMutation({
    mutationKey: ["editAvailableCurrencies"],
    mutationFn: editAvailableCurrencyActions,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: errorHandler(),
  });
  return (
    <AddEditValueDialog
      currencyId={row.original.id}
      mode="Edit"
      defaultValue={formatCurrency(row.original.value, "client")}
      handleEditSubmit={editAvailableCurrencies}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <LucideIcon name="EllipsisVertical" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            destructive
            disabled={row.original.isDefault}
            onClick={() => {
              deleteAvailableCurrencies.mutate({ currencyId: row.original.id });
            }}
          >
            <LucideIcon name="SquarePlus" />
            <span>Remove Currency</span>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <LucideIcon name="PenLine" />
              <span>Edit</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </AddEditValueDialog>
  );
};

const AddEditValueDialogSchema = z.object({
  currencyValue: z
    .number({
      coerce: true,
    })
    .min(0)
    .multipleOf(0.01, {
      message: "Max Decimal Places allowed: 2",
    }),
});

const AddEditValueDialog = ({
  children,
  currencyId,
  mode,
  handleEditSubmit,
  handleAddSubmit,
  defaultValue,
}: PropsWithChildren<{
  currencyId: string;
  mode: "Edit" | "Add";
  defaultValue?: number;
  handleEditSubmit?: UseMutationResult<
    string,
    Error,
    {
      value: number;
      currencyId: string;
    },
    unknown
  >;
  handleAddSubmit?: (id: string, value: number) => void;
}>) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddEditValueDialogSchema>>({
    defaultValues: { currencyValue: defaultValue ?? 1 },
    resolver: zodResolver(AddEditValueDialogSchema),
    mode: "all",
  });

  const onSubmit = form.handleSubmit((data) => {
    if (mode === "Edit")
      handleEditSubmit?.mutate({
        currencyId,
        value: formatCurrency(Number(data.currencyValue)),
      });
    if (mode === "Add") handleAddSubmit?.(currencyId, data.currencyValue);
    handleOpenChange();
  });
  const handleOpenChange = () => {
    setOpen((prev) => {
      if (prev) {
        form.reset();
      }
      return !prev;
    });
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              onSubmit(e);
            }}
            className="flex flex-1 flex-col gap-5"
          >
            <DialogHeader>
              <DialogTitle>Enter default value</DialogTitle>
              <DialogDescription>Value with respect to 1 USD</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="currencyValue"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{mode} Value</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export function DefaultCurrency({
  availableCurrencies,
}: {
  availableCurrencies: GetCurrencyActionResponse["currencies"][0][];
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const defaultCurrency = useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: updateDefaultCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: errorHandler(),
  });
  const defaultCurrencyValue = availableCurrencies.find((curr) => curr.isDefault);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={defaultCurrency.isPending}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-[200px]"
        >
          <span>
            <span className="text-gray-500">Default: </span>
            {!defaultCurrencyValue && "Select Currency"}
            {defaultCurrencyValue && `${defaultCurrencyValue?.symbol} ${defaultCurrencyValue?.name}`}
          </span>
          {defaultCurrency.isPending ? (
            <LucideIcon name="Loader" className="animate-spin" />
          ) : (
            <LucideIcon name="ChevronDown" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandList>
            {availableCurrencies.map((curr) => {
              return (
                <CommandItem
                  onSelect={(value) => {
                    setOpen(false);
                    defaultCurrency.mutate({ currencyId: value });
                  }}
                  key={curr.id}
                  value={curr.id}
                >
                  {curr.name}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

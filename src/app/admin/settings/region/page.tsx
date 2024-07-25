"use client";
import { fetchCountriesAction } from "@/actions/country.actions";
import { getCurrencyAction, GetCurrencyActionResponse } from "@/actions/currency.actions";
import {
  createRegionAction,
  deleteRegionAction,
  editRegionAction,
  fetchRegionsAction,
  fetchRegionsActionResponse,
} from "@/actions/region.actions";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { errorHandler } from "@/lib/query.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  //Region Query
  const { data, isFetching } = useQuery<fetchRegionsActionResponse>({
    queryKey: ["fetchRegions"],
    queryFn: async () => await fetchRegionsAction(),
  });
  return (
    <main className="container flex min-h-[calc(100vh-theme(space.20))] flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <header className="relative flex justify-between gap-5 align-middle">
        <h1 className="flex-1 text-2xl font-bold">Region</h1>
        <article>
          <CreateEditRegionSheet mode="Create">
            <SheetTrigger asChild>
              <Button>
                <LucideIcon name="Plus" />
                <span>Create</span>
              </Button>
            </SheetTrigger>
          </CreateEditRegionSheet>
        </article>
      </header>
      <section>
        <DataTable loading={isFetching} columns={RegionColumns} data={data?.regions ?? []} />
      </section>
    </main>
  );
}
const RegionColumns: DataTableProps<fetchRegionsActionResponse["regions"][0]>["columns"] = [
  {
    header: "Name",
    accessorKey: "region",
  },
  {
    header: "Currency",
    accessorKey: "currency",
    cell: ({ row }) => {
      return <div className="flex flex-col gap-1">{row.original.currencies[0].name}</div>;
    },
  },
  {
    header: "Countries",
    accessorKey: "countries",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 align-middle">
          {row.original.countries.slice(0, 3).map((country, idx) => {
            return (
              <span key={country?.id}>
                {country?.display_name}
                {idx !== row.original.countries.length - 1 && ","}
              </span>
            );
          })}
          {row.original.countries.length > 3 && <span>+{row.original.countries.length - 3} more</span>}
        </div>
      );
    },
  },

  {
    header: "Actions",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <ActionsDropdown row={row} />
        </div>
      );
    },
  },
];
const RegionClientSchema = z.object({
  title: z.string(),
  currencyId: z.string(),
  countries: z.string().array(),
});
const CreateEditRegionSheet = ({
  children,
  row,
  mode,
}: PropsWithChildren<{
  mode: "Create" | "Edit";
  row?: Row<fetchRegionsActionResponse["regions"][0]>;
}>) => {
  const [isOpen, onOpenChange] = useState(false);
  const queryClient = useQueryClient();

  //Currency Query
  const { data: currencies } = useQuery({
    queryKey: ["fetchCurrency"],
    queryFn: () => getCurrencyAction(),
    select(data) {
      return data.currencies;
    },
  });

  //Country Query
  const { data: countries } = useQuery({
    queryKey: ["fetchCountry"],
    queryFn: () => fetchCountriesAction(),
    select(data) {
      return data?.map((country) => {
        return {
          label: `${country.displayName} ${country.regionId && country.regionId !== row?.original.id ? regionsIdNameMap?.[country.regionId] : ""}`,
          value: country.id,
          isDisabled:
            mode === "Create" ? !!country.regionId : country.regionId !== row?.original.id && country.regionId !== null,
        };
      });
    },
  });
  console.log({ isOpen, countries });

  //create Region
  const createRegionMutation = useMutation({
    mutationKey: ["createRegionMutation"],
    onError: errorHandler(),
    mutationFn: createRegionAction,
    onSuccess: () => {
      form.reset();
      onOpenChange((prv) => !prv);
      queryClient.refetchQueries({
        queryKey: ["fetchRegions"],
      });
      queryClient.refetchQueries({
        queryKey: ["fetchCountry"],
      });
    },
  });

  //fetch all regions
  const regionsIdNameMap = useMemo(() => {
    const regions = queryClient.getQueryData<fetchRegionsActionResponse>(["fetchRegions"])?.regions;
    return regions?.reduce(
      (acc, ele) => ({
        ...acc,
        [ele.id]: ele.region,
      }),
      {} as Record<string, string>,
    );
  }, [queryClient]);

  //edit Region
  const editRegionMutation = useMutation({
    mutationKey: ["editRegionMutation"],
    onError: errorHandler(),
    mutationFn: editRegionAction,
    onSuccess: () => {
      form.reset();
      onOpenChange((prv) => !prv);
      queryClient.refetchQueries({
        queryKey: ["fetchRegions"],
      });
      queryClient.refetchQueries({
        queryKey: ["fetchCountry"],
      });
    },
  });

  const defaultValues = useMemo(() => {
    return mode === "Create"
      ? {}
      : {
          title: row?.original.region,
          currencyId: row?.original.currencies[0].id,
          countries: row?.original?.countries?.map((country) => country.id),
        };
  }, [mode, row]);

  const form = useForm<z.infer<typeof RegionClientSchema>>({
    defaultValues,
    resolver: zodResolver(RegionClientSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (mode === "Create")
      createRegionMutation.mutate({
        name: data.title,
        currencyId: data.currencyId,
        countryIds: data.countries,
      });
    if (mode === "Edit")
      editRegionMutation.mutate({
        name: data.title,
        regionId: row?.original.id ?? "",
        currencyId: data.currencyId,
        countryIds: data.countries,
      });
  });

  const handleCurrency = useCallback(
    (currencyId: string) => {
      form.setValue("currencyId", currencyId);
    },
    [form],
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        form.reset();
        onOpenChange((prv) => !prv);
      }}
    >
      {children}
      <Form {...form}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{mode} Region</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="body my-4 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="currencyId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <CurrencyDropdown
                          currencies={currencies}
                          handleCurrency={handleCurrency}
                          currencyId={form.getValues("currencyId")}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="countries"
                render={({ field: { onChange } }) => {
                  return (
                    <FormItem>
                      <FormLabel>Countries</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={countries ?? []}
                          onValueChange={onChange}
                          defaultValue={form.getValues("countries") ?? []}
                          placeholder="Select Countries"
                          variant="secondary"
                          maxCount={3}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" variant="outline" className="flex-1">
                {mode}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Form>
    </Sheet>
  );
};
const CurrencyDropdown = ({
  currencies,
  handleCurrency,
  currencyId,
}: {
  currencies?: GetCurrencyActionResponse["currencies"][0][];
  handleCurrency: (currencyId: string) => void;
  currencyId?: string | undefined;
}) => {
  const [value, setValue] = useState({
    currencyId: "",
    name: "",
  });
  // if (currencyId && !value.currencyId) {
  //   setValue({
  //     currencyId: currencyId,
  //     name: currencies?.find((curr) => curr.id === currencyId)?.name ?? "",
  //   });
  // }
  const currency = currencies?.find((curr) => curr.id === value.currencyId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between py-5">
          {currency ? currency.name : "Choose Currency"}
          <ChevronsUpDown className="ml-2 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm p-0">
        <Command>
          <CommandInput placeholder="Search Currency..." />
          <CommandEmpty>No such currency found.</CommandEmpty>
          <CommandList>
            {currencies?.map((curr) => {
              return (
                <CommandItem
                  key={curr.id}
                  value={curr.name}
                  onSelect={(currentValue) => {
                    if (currentValue !== value.name) {
                      //to show the selected currency
                      setValue({
                        name: currentValue,
                        currencyId: curr.id,
                      });
                      //trigger another form setValue
                      handleCurrency(curr.id);
                    }
                  }}
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
};

const ActionsDropdown = ({ row }: { row: Row<fetchRegionsActionResponse["regions"][0]> }) => {
  const queryClient = useQueryClient();
  const deleteRegion = useMutation({
    mutationKey: ["deleteRegionAction"],
    mutationFn: deleteRegionAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["fetchRegions"],
      });
    },
    onError: () => {
      console.log("deleteAvailableCurrencies");
      errorHandler();
    },
  });
  return (
    <CreateEditRegionSheet mode="Edit" row={row}>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <LucideIcon name="EllipsisVertical" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            destructive
            onClick={() => {
              deleteRegion.mutate({ regionId: row.original.id });
            }}
          >
            <LucideIcon name="SquarePlus" />
            <span>Delete</span>
          </DropdownMenuItem>
          <SheetTrigger asChild>
            <DropdownMenuItem>
              <LucideIcon name="PenLine" />
              <span>Edit</span>
            </DropdownMenuItem>
          </SheetTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </CreateEditRegionSheet>
  );
};

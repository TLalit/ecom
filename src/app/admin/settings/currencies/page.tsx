"use client";
import { createAvailableCurrencyAction, deleteAvailableCurrencyAction, editAvailableCurrencyActions, getCurrencyAction, GetCurrencyActionResponse, updateDefaultCurrencyAction } from "@/actions/currency.actions";
import { DataTable, DataTableProps } from "@/components/global/data-table";
import { LucideIcon } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { errorHandler } from "@/lib/query.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {

  const { data, isFetching } = useQuery
    ({
      queryKey: ["getCurrencies"],
      queryFn: async () => getCurrencyAction(),
      select(data) {

        const availableCurrency = data?.currencies?.filter((curr) => curr.isAvailable)
        const unAvailableCurrency = data?.currencies?.filter((curr) => !curr.isAvailable)

        return {
          availableCurrency,
          unAvailableCurrency,
          total: data.total
        }
      },
    });


  return (
    <main className="container flex min-h-[calc(100vh-theme(space.20))] flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="flex justify-between gap-4 relative ">
        <h1 className="text-2xl font-bold flex-1">Currencies</h1>
        <section className="actions flex gap-4 ">
          <DefaultCurrency availableCurrencies={data?.availableCurrency ?? []} />

          <AddCurrencySheet currencies={data?.unAvailableCurrency ?? []} >
            <SheetTrigger asChild>
              <Button>
                <LucideIcon name="Plus" />
                <span>Add </span>
              </Button>
            </SheetTrigger>
          </AddCurrencySheet>
        </section>
      </section>

      <DataTable
        loading={isFetching}
        columns={availableCurrencyColumns}
        data={data?.availableCurrency}

      />
    </main>
  );
}

const formatCurrency = (currency: number, mode?: 'client') => {
  if (mode && mode === 'client') {
    return currency / 100
  } else
    return currency * 100
}

const AddCurrencySheet = ({ children, currencies }: PropsWithChildren<{ currencies: GetCurrencyActionResponse['currencies'][0][] }>) => {
  const [open, onOpenChange] = useState(false);
  const queryClient = useQueryClient();


  const addCurrencyHandler = useMutation({
    mutationKey: ["addCurrencyHandler"],
    mutationFn: createAvailableCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
      form.reset();
      onOpenChange(prev => !prev)
    },
    onError: () => {
      console.log("addCurrencyHandlerError");
      errorHandler();
    },
  });
  const form = useForm();
  const onSubmit = form.handleSubmit(async (data) => {
    console.log({ data });

    const definedCurr: [string, number][] = Object.entries(data).filter(curr => curr[1]);
    const availableCurrencies = definedCurr.reduce((acc, curr) => {
      const tempCurr = {
        currencyId: curr[0],
        value: formatCurrency(Number(curr[1]))
      };
      acc.push(tempCurr);
      return acc;
    }, [] as { currencyId: string, value: number }[]);
    addCurrencyHandler.mutate({ availableCurrencies })

  })

  const handleForm = (id: string, value: number) => {
    form.setValue(id, value);
  }
  return <Sheet open={open} onOpenChange={() => { form.reset(); onOpenChange(prev => !prev) }}>
    {children}
    <Form {...form}>
      <SheetContent >
        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
          <SheetHeader>
            <SheetTitle> Add Store Currencies</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-2">
            {currencies.map((curr, idx) => {
              return <div key={idx} className="flex justify-start gap-2 items-center ">
                <AddEditValueDialog id={curr.id} mode={"Add"} handleAddSubmit={handleForm}>
                  <DialogTrigger asChild>
                    <Checkbox
                      checked={!!form.watch(curr.id)}
                      name={curr.id} />
                  </DialogTrigger>

                  <Label htmlFor={curr.id} className="text-left">
                    {curr.name}
                  </Label>
                </AddEditValueDialog>
                <FormMessage />

              </div>

            })}
          </div>

          {!!currencies.length ? <LoadingButton
            type="submit"
            className="flex-1"
            loading={form.formState.isSubmitting}
          >
            Add
          </LoadingButton> : <div>No currencies to add</div>}
        </form>
      </SheetContent>
    </Form>


  </Sheet >
}

const availableCurrencyColumns: DataTableProps<GetCurrencyActionResponse['currencies'][0]>["columns"] = [
  {
    header: 'Code',
    accessorKey: "code",
    cell: ({ row }) => {
      return <div className="">
        {row.original.code}
      </div>
    }
  },
  {
    header: 'Current Value',
    accessorKey: "value",
    cell: ({ row }) => {
      return <div className="">
        {row.original.symbol}{formatCurrency(row.original.value, 'client')}
      </div>
    }
  },
  {
    header: 'Name',
    accessorKey: "name",
    cell: ({ row }) => {
      return <div className="flex gap-2">
        <span>{row.original.name}</span>
        {row.original.isDefault && <Badge variant={'secondary'}>Default</Badge>}

      </div>
    }
  },

  {
    header: 'Actions', accessorKey: 'id', cell({ row }) {
      return <ActionsDropdown row={row} />
    },
  }
]

const ActionsDropdown = ({ row }: { row: Row<GetCurrencyActionResponse['currencies'][0]> }) => {
  const queryClient = useQueryClient();
  const deleteAvailableCurrencies = useMutation({
    mutationKey: ["deleteAvailableCurrencies"],
    mutationFn: deleteAvailableCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: () => {
      console.log("deleteAvailableCurrencies");
      errorHandler();
    },
  });
  const editAvailableCurrencies = useMutation({
    mutationKey: ["editAvailableCurrencies"],
    mutationFn: editAvailableCurrencyActions,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: () => {
      console.log("editAvailableCurrencies");
      errorHandler();
    },
  });
  return (
    <AddEditValueDialog id={row.original.id} mode='Edit' defaultValue={formatCurrency(row.original.value, 'client')} handleEditSubmit={editAvailableCurrencies}>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2">
          <LucideIcon name="EllipsisVertical" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem
            destructive
            disabled={row.original.isDefault}
            onClick={() => {
              deleteAvailableCurrencies.mutate({ currencyId: row.original.id })
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
  )


}

const AddEditValueDialogSchema = z.object({
  currencyValue: z.number({
    coerce: true,
  }).min(0).multipleOf(0.01, {
    message: 'Max Decimal Places allowed: 2'
  })
});

const AddEditValueDialog = ({ children, id, mode, handleEditSubmit, handleAddSubmit, defaultValue }: PropsWithChildren<{
  id: string,
  mode: 'Edit' | 'Add',
  defaultValue?: number,
  handleEditSubmit?: UseMutationResult<string, Error, {
    value: number;
    currencyId: string;
  }, unknown>,
  handleAddSubmit?: (id: string, value: number) => void
}>) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof AddEditValueDialogSchema>>({
    defaultValues: { currencyValue: defaultValue ?? 1 },
    resolver: zodResolver(AddEditValueDialogSchema),
    mode: 'all'
  });

  const onSubmit = (currencyId: string) => {
    if (mode === 'Edit') handleEditSubmit?.mutate({ currencyId, value: formatCurrency(Number(form.watch('currencyValue'))) })
    if (mode === 'Add') handleAddSubmit?.(currencyId, form.watch('currencyValue'))
  }
  const handleOpenChange = () => {
    setOpen(prev => {
      if (prev) {
        form.reset()
      }
      return !prev
    })
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <Form {...form}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={() => onSubmit(id)} className="flex flex-1 flex-col gap-5">
            <DialogHeader>
              <DialogTitle>Enter default value</DialogTitle>
              <DialogDescription>
                Value with respect to 1 USD
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="currencyValue"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{mode} Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>

        </DialogContent>
      </Form>
    </Dialog >
  )
}

const DefaultCurrency = ({ availableCurrencies }: { availableCurrencies: GetCurrencyActionResponse['currencies'][0][] }) => {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const queryClient = useQueryClient();

  const defaultCurrency = useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: updateDefaultCurrencyAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getCurrencies"],
      });
    },
    onError: () => {
      console.log("deleteCollectionError");
      errorHandler();
    },
  });

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-[200px] justify-between"
      >
        {value
          ? availableCurrencies.find((curr) => curr.name === value)?.name
          : "Choose Default"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0 max-h-5">
      <Command>
        <CommandInput placeholder="Search Currency..." />
        <CommandEmpty>No such currency found.</CommandEmpty>
        <CommandGroup>
          <CommandList>
            {availableCurrencies?.map((curr) => {

              return <CommandItem
                key={curr.id}
                value={curr.name}
                onSelect={(currentValue) => {
                  console.log(currentValue)
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  defaultCurrency.mutate({ currencyId: curr.id })
                }}
              >
                {curr.name}
              </CommandItem>

            })}
          </CommandList>

        </CommandGroup>
      </Command>
    </PopoverContent>


  </Popover>
}


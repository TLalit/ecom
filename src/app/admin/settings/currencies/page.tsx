"use client";
import { getCurrencyAction } from "@/actions/currency.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PropsWithChildren, useState } from "react";
import { Form } from "react-hook-form";

export default function Page() {
  const { data, isFetching } = useQuery({
    queryKey: ["getCurrencies"],
    queryFn: async () => getCurrencyAction(),
  });



  return (
    <>
      <Card className="mx-auto max-w-4xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Currencies</CardTitle>
          <CardDescription>
            Manage the markets that you will operate within.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="mx-auto max-w-4xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Store currencies</CardTitle>
          <CardDescription className="flex justify-between">
            All the currencies available in your store.
            <Button>Edit Currencies</Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>Currency</div>
          {/* {data?.availableCurrencies?.map((curr) => { return <>{curr.name}</> })} */}
        </CardContent>

      </Card>
    </>
  );
}


const AddEditCollectionSheet = ({ children }: PropsWithChildren) => {
  const [open, onOpenChange] = useState(false);
  const onSubmit = () => { }
  return <Sheet open={open} onOpenChange={onOpenChange}>
    {children}
    {/* <Form {...form}>
      <SheetContent className="flex">
        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
          <SheetHeader>
            <SheetTitle>{mode} Collection</SheetTitle>
          </SheetHeader>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("slug", generateSlug(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-24" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {collectionStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {visibilityStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => {
              const previewFiles = (field.value ?? [])?.map(({ url }) => ({
                src: url,
                width: 240,
                height: 240,
                className: "aspect-square",
              }));
              return (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex gap-5">
                      <FileUploader
                        {...field}
                        className="size-60"
                        hideOnSelect
                      />
                      <ImageList
                        images={previewFiles}
                        onRemove={({ src }) => {
                          field.onChange(
                            field.value.filter((item) => item.url !== src),
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <SheetFooter className="gap-5">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              className="flex-1"
              loading={form.formState.isSubmitting}
            >
              {mode}
            </LoadingButton>
          </SheetFooter>
        </form>
      </SheetContent>
    </Form> */}
  </Sheet>
}
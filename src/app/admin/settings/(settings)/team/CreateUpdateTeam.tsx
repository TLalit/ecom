"use client";
import { createTeamMemberAction, GetTeamActionResponse, updateTeamMemberAction } from "@/actions/user.actions";
import { PasswordInput } from "@/components/global";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { MultiSelect } from "@/components/ui/multi-select";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { errorHandler } from "@/lib/query.helper";
import { RoleArray, RoleLabel, UserRoles } from "@/types/db.types";
import { createTeamMemberSchema, updateTeamMemberSchema } from "@/validators/user.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createTeamMemberClientSchema = createTeamMemberSchema
  .merge(
    z.object({
      confirmPassword: z.string().min(8),
    }),
  )
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
      return false;
    }
    return true;
  });

const editTeamMemberClientSchema = updateTeamMemberSchema.omit({
  id: true,
});

export const CreateUpdateTeam = ({
  children,
  mode,
  row,
}: PropsWithChildren<{ mode: "Create" | "Edit"; row?: GetTeamActionResponse["team"][0] }>) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createTeamMemberClientSchema>>({
    defaultValues: {
      name: row?.name || "",
      email: row?.email || "",
      roles: row?.roles ?? [UserRoles.manager],
      password: mode === "Edit" ? "1234567890" : "",
      confirmPassword: mode === "Edit" ? "1234567890" : "",
    },
    resolver: zodResolver(mode === "Create" ? createTeamMemberClientSchema : editTeamMemberClientSchema),
  });

  const createUserMutation = useMutation({
    mutationFn: createTeamMemberAction,
    onSuccess: () => {
      toast.success("User created successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["getTeamAction"] });
      setOpen(false);
    },
    onError: errorHandler(),
  });
  const updateUserMutation = useMutation({
    mutationFn: updateTeamMemberAction,
    onSuccess: () => {
      toast.success("Team member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getTeamAction"] });
      setOpen(false);
    },
    onError: errorHandler(),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (mode === "Create") {
      await createUserMutation.mutateAsync({
        email: data.email,
        name: data.name,
        roles: data.roles,
        password: data.password,
      });
    }
    if (row && mode === "Edit") {
      await updateUserMutation.mutateAsync({
        id: row.id,
        email: data.email,
        name: data.name,
        roles: data.roles,
      });
    }
  });
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setOpen(open);
  };
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {children}
      <SheetContent className="flex">
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5">
            <SheetHeader>
              <SheetTitle>Create Team Member</SheetTitle>
            </SheetHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={RoleArray.map((role) => ({
                        value: role,
                        label: RoleLabel[role],
                      }))}
                      onValueChange={(values) => field.onChange(values)}
                      defaultValue={form.getValues("roles")}
                      placeholder="Select Countries"
                      variant="secondary"
                      maxCount={3}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "Create" && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} autoComplete="new-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} autoComplete="new-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <LoadingButton loading={createUserMutation.isPending} type="submit">
                Save
              </LoadingButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

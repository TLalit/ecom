"use client";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LucideIcon } from "../icons/icon";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LoadingButton } from "../ui/loading-button";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const LoginForm = () => {
  const { signInWithCredentials, errorMessage } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = form.handleSubmit(signInWithCredentials);
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {errorMessage && (
          <Alert variant="destructive">
            <LucideIcon name="TriangleAlert" className="size-5" />
            <AlertTitle>{errorMessage.message}</AlertTitle>
            <AlertDescription>
              If you don&apos;t have an account,
              <br /> please{" "}
              <Link href={errorMessage.singUnUrl} className="underline">
                Sign up
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <FormField
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} type="email" placeholder="" />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input {...field} type="password" placeholder="" />
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <LoadingButton
          loading={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Login
        </LoadingButton>
      </form>
    </Form>
  );
};

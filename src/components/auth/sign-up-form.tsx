"use client";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { errorHandler } from "@/lib/query.helper";
import { PostSignUpRequest, PostSignUpResponse } from "@/types/sign-up.api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LucideIcon } from "../icons/icon";
import { Alert, AlertTitle } from "../ui/alert";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { LoadingButton } from "../ui/loading-button";
const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
type TSignUpSchema = z.infer<typeof signUpSchema>;

export const SingUpForm = () => {
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");
  const { signInWithCredentials } = useAuth();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });
  const signUpMutation = useMutation({
    mutationKey: ["mutation", "signup"],
    mutationFn: (data: PostSignUpRequest) => axios.post<PostSignUpResponse>("/api/sign-up", data),
    onSuccess: (_, variables) =>
      signInWithCredentials({
        email: variables.email,
        password: variables.password,
      }),
    onError: errorHandler(({ message }) => setSignUpErrorMessage(message ?? "Unknown error")),
  });
  const onSubmit = form.handleSubmit((data) => signUpMutation.mutate(data));
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {signUpErrorMessage && (
          <Alert variant="destructive" className="flex items-center [&>svg]:top-2">
            <LucideIcon name="TriangleAlert" className="size-5" />
            <AlertTitle className="mb-0">{signUpErrorMessage}</AlertTitle>
          </Alert>
        )}
        <FormField
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} placeholder="" />
                <FormMessage />
              </FormItem>
            );
          }}
        />
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
        <LoadingButton loading={signUpMutation.isPending} type="submit" className="w-full">
          Create Account Now
        </LoadingButton>
      </form>
    </Form>
  );
};

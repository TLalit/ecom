import Link from "next/link";

import { SignInWithGoogle } from "@/components/auth/google-login-button";
import { SingUpForm } from "@/components/auth/sign-up-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  return (
    <Card className="mx-auto max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <SingUpForm />
          <SignInWithGoogle />
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

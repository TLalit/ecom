"use client";
import { useAuth } from "@/hooks/useAuth";
import { IconGoogleLogo } from "../svgs";
import { Button } from "../ui/button";

export function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button variant="outline" className="w-full gap-2" onClick={signInWithGoogle}>
      <IconGoogleLogo className="size-4" />
      <span> Login with Google</span>
    </Button>
  );
}

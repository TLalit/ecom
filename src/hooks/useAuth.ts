import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryParams } from "./useQueryParams";

export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState<{
    message: string;
    singUnUrl: string;
  } | null>(null);
  const { searchParams } = useQueryParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const { data, status, update } = useSession();
  const router = useRouter();
  const signInWithCredentials = async (credentials: { email: string; password: string }) => {
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl,
      ...credentials,
    });

    if (res?.url) {
      router.replace(res.url);
    }
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setErrorMessage({
          message: "Invalid email or password.",
          singUnUrl: `/register?email=${credentials.email}`,
        });
      }
    }
  };

  const signInWithGoogle = async () =>
    signIn("google", {
      callbackUrl,
    });
  return {
    user: data?.user,
    status,
    signOut,
    signInWithCredentials,
    signInWithGoogle,
    errorMessage,
  };
};

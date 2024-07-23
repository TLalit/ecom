import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default function Page({ children }: PropsWithChildren) {
  const headersList = headers();
  if (!headersList.get("host")?.includes("localhost")) {
    return redirect("/admin");
  }
  return <div>{children}</div>;
}

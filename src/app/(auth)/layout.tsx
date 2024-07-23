import { auth } from "@/auth";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session) {
    return redirect("/", RedirectType.replace);
  }
  return (
    <main className="relative flex min-h-screen flex-row">
      <div className="z-10 flex flex-1 flex-col items-center justify-center p-4">{children}</div>
      {/* <div className="absolute inset-0 -z-10 flex-1 bg-gray-100 lg:relative"> */}
      <Image src="https://picsum.photos/1200/800" fill className="object-cover" alt="Background" />
      {/* </div> */}
    </main>
  );
}

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Settings() {
  return (
    <main className="container flex min-h-[calc(100vh-theme(space.20))] flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="relative flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Manage the general settings for your store</p>
      </section>
      <section>
        <Link href={'/admin/settings/currencies'}>
          <Card className="mx-auto max-w-sm shadow-2xl">Currencies</Card>
        </Link>
        <Link href={'/admin/settings/region'}>
          <Card className="mx-auto max-w-sm shadow-2xl">Region</Card>
        </Link>
      </section>
    </main>
  );
}

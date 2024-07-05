import { SheetTrigger } from "@/components/ui/sheet";
import { CreateUpdateCollectionSheet } from "../collection/page";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/icons/icon";
import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <main className="container flex min-h-[calc(100vh-theme(space.20))] flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="relative flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Manage the general settings for your store</p>
      </section>
      <section>
        <CreateUpdateCollectionSheet mode="Create">
          <SheetTrigger asChild>
            <Card className="mx-auto max-w-sm shadow-2xl">Currencies</Card>
          </SheetTrigger>
        </CreateUpdateCollectionSheet>
      </section>
    </main>
  );
}

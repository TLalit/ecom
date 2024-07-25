"use client";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionTable } from "./CollectionTable";
import { CreateUpdateCollectionSheet } from "./CreateEditCollection";

export default function Page() {
  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <Tabs defaultValue="collection">
        <TabsList>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="collection">
          <section className="flex flex-col gap-5">
            <div className="relative flex items-center justify-between gap-5">
              <h1 className="text-2xl font-bold">Collection</h1>
              <CreateUpdateCollectionSheet mode="Create">
                <SheetTrigger asChild>
                  <Button>
                    <LucideIcon name="Plus" />
                    <span>Add</span>
                  </Button>
                </SheetTrigger>
              </CreateUpdateCollectionSheet>
            </div>
            <CollectionTable />
          </section>
        </TabsContent>
        <TabsContent value="categories">
          <section className="flex flex-col gap-5">
            <div className="relative flex items-center justify-between gap-5">
              <h1 className="text-2xl font-bold">Categories</h1>
              <CreateUpdateCollectionSheet mode="Create">
                <SheetTrigger asChild>
                  <Button>
                    <LucideIcon name="Plus" />
                    <span>Add</span>
                  </Button>
                </SheetTrigger>
              </CreateUpdateCollectionSheet>
            </div>
            <CollectionTable />
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}

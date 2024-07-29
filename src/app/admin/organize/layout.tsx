"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function OrganizeLayout({
  collection,
  categories,
}: {
  collection: React.ReactNode;
  categories: React.ReactNode;
}) {
  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <Tabs defaultValue="collection">
        <TabsList>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="collection">{collection}</TabsContent> */}
        <TabsContent value="categories">{categories}</TabsContent>
      </Tabs>
    </main>
  );
}

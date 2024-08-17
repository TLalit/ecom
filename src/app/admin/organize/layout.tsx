"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryParams } from "@/hooks";
import { useCallback } from "react";
export default function OrganizeLayout({
  collection,
  categories,
  products,
}: {
  collection: React.ReactNode;
  categories: React.ReactNode;
  products: React.ReactNode;
}) {
  const { searchParams, setSearchParams } = useQueryParams();
  const tab = searchParams.get("tab") ?? "products";
  const setTab = useCallback(
    (tab: string) => {
      setSearchParams({ tab }, { replace: true });
    },
    [setSearchParams],
  );

  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="products">{products}</TabsContent>
        <TabsContent value="collection">{collection}</TabsContent>
        <TabsContent value="categories">{categories}</TabsContent>
      </Tabs>
    </main>
  );
}

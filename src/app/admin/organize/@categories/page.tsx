"use client";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { CreateUpdateCategorySheet } from "./CreateUpdateCategory";

export default function Page() {
  return (
    <section className="flex flex-col gap-5">
      <div className="relative flex items-center justify-between gap-5">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CreateUpdateCategorySheet mode="Create">
          <SheetTrigger asChild>
            <Button>
              <LucideIcon name="Plus" />
              <span>Add</span>
            </Button>
          </SheetTrigger>
        </CreateUpdateCategorySheet>
      </div>
    </section>
  );
}

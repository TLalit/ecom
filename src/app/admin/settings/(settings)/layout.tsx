"use client";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

export default function AdminSettingsLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Button onClick={() => router.back()} variant="ghost" className="flex max-w-max items-center gap-2">
        <LucideIcon name="ArrowLeft" />
        <span>Back to settings</span>
      </Button>
      {children}
    </div>
  );
}

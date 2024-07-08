import Link from "next/link";

import { auth } from "@/auth";
import { ConfirmationDialog } from "@/components/global/confirmation-dialog";
import { UserMenu } from "@/components/global/user-menu";
import { IconProps, LucideIcon } from "@/components/icons/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RedirectType, redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { ThemeSwitch } from "../theme-switch";
const sidebarItems: {
  name: string;
  icon: IconProps["name"];
  href: string;
}[] = [
    {
      name: "Dashboard",
      icon: "Home",
      href: "/admin",
    },
    {
      name: "Collection",
      icon: "LayoutDashboard",
      href: "/admin/collection",
    },
    {
      name: "Orders",
      icon: "ShoppingCart",
      href: "/admin/orders",
    },
    {
      name: "Products",
      icon: "Package",
      href: "/admin/products",
    },
    {
      name: "Customers",
      icon: "Users",
      href: "/admin/customers",
    },
  ];
export default async function AdminRootLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) {
    return redirect("/login", RedirectType.replace);
  }
  return (
    <>
      <TooltipProvider>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 pl-0">
            <Link
              href="#"
              className="flex h-full w-14 items-center justify-center border-r"
            >
              <LucideIcon name="Store" className="size-8" />
            </Link>
            {/* <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Orders</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}

            <div className="flex-1"></div>
            <ThemeSwitch />
            <UserMenu className="flex-none" />
          </header>
          <div className="relative flex flex-1">
            <aside className="flex w-14 flex-col border-r">
              <nav className="box-border flex flex-1 flex-col items-center gap-4 py-2">
                {sidebarItems.map((item) => (
                  <Tooltip key={item.name}>
                    <TooltipTrigger
                      asChild
                      className="flex size-10 items-center justify-center rounded-xl hover:bg-accent"
                    >
                      <Link href={item.href}>
                        <LucideIcon name={item.icon} />
                        <span className="sr-only">{item.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ))}
              </nav>
              <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="flex size-10 items-center justify-center"
                  >
                    <Link href="/admin/settings/currencies">
                      <LucideIcon name="Settings" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </nav>
            </aside>

            <ScrollArea className="flex-co flex max-h-[calc(100vh-theme(space.16))] flex-1 bg-accent">
              <div className="flex flex-1 flex-col p-2">{children}</div>
            </ScrollArea>
          </div>
        </div>
      </TooltipProvider>
      <ConfirmationDialog />
    </>
  );
}

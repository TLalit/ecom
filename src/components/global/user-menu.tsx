"use client";
import { LucideIcon } from "@/components/icons/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

export const UserMenu = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => {
  const pathName = usePathname();
  const { user, status, signOut } = useAuth();
  if (status === "loading") return null;
  return (
    <div className={cn("flex flex-1 items-center justify-end gap-2", className)} {...rest}>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user?.profilePicture ?? undefined} alt={user?.email ?? ""} />
                <AvatarFallback>
                  <CircleUser className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-xl">{user?.name}</span>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LucideIcon name="Settings" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcon name="Headset" />
              <span>Support</span>
            </DropdownMenuItem>
            {user?.roles?.includes("admin") && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <LucideIcon name="UserCog" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/",
                })
              }
            >
              <LucideIcon name="LogOut" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link href={`/login?callbackUrl=${pathName}`}>
              <LucideIcon name="LogIn" />
              <span>Login</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button asChild>
            <Link href={`/register?callbackUrl=${pathName}`}>Create Account</Link>
          </Button>
        </>
      )}
    </div>
  );
};

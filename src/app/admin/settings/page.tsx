import { IconProps, LucideIcon } from "@/components/icons/icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const settings: {
  icon: IconProps["name"];
  title: string;
  href: string;
  description: string;
}[] = [
  {
    icon: "Globe",
    title: "Regions",
    href: "/admin/settings/region",
    description: "Manage the region for your store",
  },
  {
    icon: "IndianRupee",
    title: "Currencies",
    href: "/admin/settings/currencies",
    description: "Manage the currencies for your store",
  },
];

export default function Settings() {
  return (
    <main className="container flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="relative flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Manage the general settings for your store</p>
      </section>
      <section className="grid grid-cols-2 gap-4">
        {settings.map((item) => (
          <Link href={item.href} key={item.href}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <LucideIcon name={item.icon} className="size-8" />
                <span>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}

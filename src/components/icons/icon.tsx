import { cn } from "@/lib/utils";
import { icons, LucideProps } from "lucide-react";

export interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

export const LucideIcon = ({ name, className, ...props }: IconProps) => {
  const Icon = icons[name];

  return <Icon {...props} className={cn("size-4 text-inherit", className)} />;
};

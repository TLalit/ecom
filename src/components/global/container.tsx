import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export const Container = ({
  className,
  ...props
}: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>) => {
  return <section className={cn("container", className)} {...props} />;
};

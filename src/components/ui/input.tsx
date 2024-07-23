import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: (props: LucideProps) => React.ReactNode;
  endIcon?: (props: LucideProps) => React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const id = React.useId();

    return (
      <>
        {StartIcon && (
          <label
            htmlFor={props?.id ?? id}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 transform cursor-pointer"
          >
            <StartIcon className="size-5 text-inherit" />
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <label
            htmlFor={props?.id ?? id}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
          >
            <EndIcon className="size-5 text-inherit" />
          </label>
        )}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };

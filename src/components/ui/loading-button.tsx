import * as React from "react";

import clsx from "clsx";
import { LucideIcon } from "../icons/icon";
import { Button, ButtonProps } from "./button";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, ...props }: LoadingButtonProps, ref) => {
    return (
      <Button ref={ref} {...props} disabled={props?.disabled || loading}>
        {loading && (
          <LucideIcon name="LoaderCircle" className="absolute animate-spin" />
        )}
        <span className={clsx({ invisible: loading })}>{props.children}</span>
      </Button>
    );
  },
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };

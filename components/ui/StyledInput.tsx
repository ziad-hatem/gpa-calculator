import * as React from "react";
import { cn } from "@/utils/cn";

export interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
StyledInput.displayName = "StyledInput";

export { StyledInput };

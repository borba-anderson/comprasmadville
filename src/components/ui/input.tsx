import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[12px] border border-transparent bg-[hsl(var(--surface-inset))] px-4 py-2 text-[16px] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[hsl(var(--text-quaternary))] focus-visible:outline-none focus-visible:bg-card focus-visible:border-[hsl(var(--border))] focus-visible:ring-4 focus-visible:ring-[hsl(var(--info))]/18 disabled:cursor-not-allowed disabled:opacity-50 md:text-[15px]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-[12px] border border-transparent bg-[hsl(var(--surface-inset))] px-4 py-3 text-[15px] transition-all duration-200 placeholder:text-[hsl(var(--text-quaternary))] focus-visible:outline-none focus-visible:bg-card focus-visible:border-[hsl(var(--border))] focus-visible:ring-4 focus-visible:ring-[hsl(var(--info))]/18 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

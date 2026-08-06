import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-[15px] font-semibold tracking-[-0.01em] transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96] outline-none focus-visible:ring-[4px] focus-visible:ring-[hsl(var(--info))]/25 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-destructive/90",
        outline:
          "border border-[hsl(var(--border))] bg-card text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--surface-2))]",
        secondary:
          "bg-[hsl(var(--surface-3))] text-primary hover:bg-[hsl(var(--surface-3))]/70",
        ghost:
          "text-primary hover:bg-[hsl(var(--surface-2))]",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants for Madville
        hero: "bg-primary text-primary-foreground shadow-[var(--shadow-tint-primary)] hover:bg-primary/90",
        success: "bg-success text-success-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-warning/90",
        info: "bg-info text-info-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-info/90",
        "outline-primary":
          "border border-primary/30 text-primary bg-primary/[0.04] hover:bg-primary/10",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 rounded-[10px] px-3 text-[13px]",
        lg: "h-12 rounded-[14px] px-6 text-[16px]",
        xl: "h-[52px] rounded-[16px] px-8 text-[17px]",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="spinner" />
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

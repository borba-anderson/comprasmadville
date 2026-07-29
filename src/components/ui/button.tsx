import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-medium tracking-[-0.006em] transition-[background-color,box-shadow,border-color,color] duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:border-primary/40 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.12),var(--shadow-elegant-sm)] hover:bg-primary/92 active:bg-primary/85",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-destructive/90",
        outline:
          "border border-[hsl(var(--border-strong))] bg-card text-[hsl(var(--text-secondary))] shadow-[var(--shadow-elegant-sm)] hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--text-primary))]",
        secondary:
          "bg-[hsl(var(--surface-3))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--surface-3))]/70",
        ghost:
          "text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--text-primary))]",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants for Madville
        hero: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.14),var(--shadow-tint-primary)] hover:bg-primary/92",
        success: "bg-success text-success-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-warning/90",
        info: "bg-info text-info-foreground shadow-[var(--shadow-elegant-sm)] hover:bg-info/90",
        "outline-primary":
          "border border-primary/30 text-primary bg-primary/[0.04] hover:bg-primary/10",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 rounded-md px-3 text-[12.5px]",
        lg: "h-11 rounded-lg px-6 text-sm",
        xl: "h-12 rounded-xl px-8 text-[15px]",
        icon: "h-9 w-9",
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

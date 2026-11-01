import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-navy text-white dark:bg-slate-700 dark:text-white",
        active: "bg-brand-navy text-white ring-2 ring-brand-navy dark:bg-brand-blue dark:text-brand-navy",
        outline: "bg-white/80 text-brand-navy border border-brand-navy/15 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        lime: "bg-brand-lime text-brand-navy font-bold",
        purple: "bg-brand-purple text-brand-navy font-bold",
        blue: "bg-brand-blue text-white font-bold",
        soft: "bg-white/60 backdrop-blur-md text-brand-navy dark:bg-slate-800/60 dark:text-slate-100",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

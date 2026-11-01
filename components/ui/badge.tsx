import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "active"
    | "outline"
    | "lime"
    | "purple"
    | "blue"
    | "soft";
}

function Badge({ className, variant = "outline", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "bg-brand-navy text-white dark:bg-slate-700 dark:text-white",
    active:
      "bg-brand-navy text-white ring-2 ring-brand-navy dark:bg-brand-blue dark:text-brand-navy",
    outline:
      "bg-white/80 text-brand-navy border border-brand-navy/15 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    lime: "bg-brand-lime text-brand-navy font-bold",
    purple: "bg-brand-purple text-brand-navy font-bold",
    blue: "bg-brand-blue text-white font-bold",
    soft:
      "bg-white/60 backdrop-blur-md text-brand-navy dark:bg-slate-800/60 dark:text-slate-100",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };

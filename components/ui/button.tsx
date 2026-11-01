import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "lime" | "blue" | "purple" | "outline" | "ghost" | "pillPlay";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target active:scale-95";

    const variants = {
      default:
        "bg-brand-navy text-white hover:bg-brand-navy/90 dark:bg-brand-blue dark:text-brand-navy dark:hover:bg-brand-blue/90 shadow-sm",
      lime: "bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold",
      blue: "bg-brand-blue text-white hover:bg-brand-blue/90 font-semibold",
      purple:
        "bg-brand-purple text-brand-navy hover:bg-brand-purple/90 font-semibold",
      outline:
        "border-2 border-brand-navy/20 bg-transparent text-brand-navy hover:bg-brand-navy/5 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
      ghost:
        "bg-transparent text-brand-navy hover:bg-black/5 dark:text-slate-100 dark:hover:bg-white/10",
      pillPlay:
        "bg-white text-brand-navy rounded-full p-3 shadow-md hover:scale-105 active:scale-95 dark:bg-slate-800 dark:text-white",
    };

    const sizes = {
      default: "h-11 px-6 py-2 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-13 px-8 text-base",
      icon: "h-11 w-11 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

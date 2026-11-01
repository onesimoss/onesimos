import * as React from "react";
import { Sparkles, Sprout, Shapes } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "spark" | "growth" | "blocks";
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ variant = "spark", className, iconOnly = false }: LogoProps) {
  const icons = {
    spark: <Sparkles className="w-6 h-6 text-brand-blue fill-brand-blue/20" />,
    growth: <Sprout className="w-6 h-6 text-brand-navy dark:text-brand-lime" />,
    blocks: <Shapes className="w-6 h-6 text-brand-purple dark:text-brand-blue" />,
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-black/5 dark:border-white/10">
        {icons[variant]}
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-brand-navy dark:text-white">
          Onesimos
        </span>
      )}
    </div>
  );
}

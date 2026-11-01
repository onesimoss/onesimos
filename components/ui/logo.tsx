import * as React from "react";
import { cn } from "@/lib/utils";

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function SproutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-1.5-.4-3-1.1-3.8-2.3-.9-1.2-1.3-2.6-1.5-4C8 7.3 9 8.3 9.5 9.4Z" />
    </svg>
  );
}

function ShapesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.3 10a.7.7 0 0 1-.626-.37l-3.3-6a.7.7 0 0 1 .626-1.03h6.6a.7.7 0 0 1 .626 1.03l-3.3 6a.7.7 0 0 1-.626.37Z" />
      <path d="M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
    </svg>
  );
}

interface LogoProps {
  variant?: "spark" | "growth" | "blocks";
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ variant = "spark", className, iconOnly = false }: LogoProps) {
  const icons = {
    spark: <SparklesIcon className="w-6 h-6 text-brand-blue fill-brand-blue/20" />,
    growth: <SproutIcon className="w-6 h-6 text-brand-navy dark:text-brand-lime" />,
    blocks: <ShapesIcon className="w-6 h-6 text-brand-purple dark:text-brand-blue" />,
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

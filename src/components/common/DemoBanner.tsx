import React from "react";
import { cn } from "@/lib/utils";

interface DemoBannerProps {
  className?: string;
}

export default function DemoBanner({ className }: DemoBannerProps) {
  return (
    <div
      className={cn(
        "w-full bg-gradient-to-r from-[hsl(var(--midnight-black))] via-[hsl(var(--crimson-red)/0.15)] to-[hsl(var(--midnight-black))] border-y border-[hsl(var(--crimson-red)/0.3)] py-1 px-4 text-center text-xs font-medium tracking-wide fade-in",
        "text-[hsl(var(--crimson-red)/0.9)] backdrop-blur-sm",
        className
      )}
    >
      <span className="inline-block subtle-pulse">
        <span className="opacity-90">•</span> ALL DATA SHOWN IS FOR DEMO
        PURPOSES ONLY <span className="opacity-90">•</span>
      </span>
    </div>
  );
}

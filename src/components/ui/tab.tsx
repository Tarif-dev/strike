
import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-2 rounded-lg bg-cricket-medium-green p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            activeTab === tab
              ? "bg-cricket-lime text-cricket-dark-green"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

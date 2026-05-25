"use client";

import { Activity, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RuntimeActivityComponent } from "@/types/runtime";
import type { RuntimeRenderContext } from "@/types/runtime-render";

interface ActivityRendererProps {
  component: RuntimeActivityComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
  context?: RuntimeRenderContext;
}

export function ActivityRenderer({ component, selected, onSelect, context }: ActivityRendererProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40",
        selected && "border-primary/60 ring-1 ring-primary/30",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect?.(component.id)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4 text-primary" aria-hidden="true" />
          {component.title}
        </div>
        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Activity feed</span>
      </button>
      <div className="grid gap-3">
        {component.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => context?.actions?.onActivityItem?.(item.title, item.detail)}
            className="rounded-lg border border-border/70 bg-background/60 p-3 text-left transition hover:bg-muted/50"
          >
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Clock3 className="size-3" aria-hidden="true" />
              {item.timestamp}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

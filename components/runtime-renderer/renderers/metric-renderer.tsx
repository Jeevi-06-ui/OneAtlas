"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getRuntimeIcon } from "@/components/runtime-renderer/icon-map";
import { RendererFrame } from "@/components/runtime-renderer/renderer-frame";
import { cn } from "@/lib/utils";
import type { RuntimeMetricComponent } from "@/types/runtime";

const toneClasses: Record<RuntimeMetricComponent["tone"], string> = {
  neutral: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

interface MetricRendererProps {
  component: RuntimeMetricComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
}

export function MetricRenderer({ component, selected, onSelect }: MetricRendererProps) {
  const Icon = getRuntimeIcon(component.icon);

  return (
    <RendererFrame id={component.id} selected={selected} onSelect={onSelect}>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{component.title}</p>
              <p className="mt-2 text-2xl font-semibold">{component.value}</p>
            </div>
            <div className={cn("rounded-md p-2", toneClasses[component.tone])}>
              <Icon className="size-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{component.trend}</p>
        </CardContent>
      </Card>
    </RendererFrame>
  );
}

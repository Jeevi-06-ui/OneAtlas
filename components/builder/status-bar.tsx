"use client";

import { Circle } from "lucide-react";

import { formatDateTime } from "@/lib/utils";
import { useBuilderStore } from "@/store/builder-store";

export function StatusBar() {
  const schema = useBuilderStore((state) => state.schema);
  const version = useBuilderStore((state) => state.version);

  return (
    <div className="flex min-h-9 flex-wrap items-center justify-between gap-2 border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Circle className="size-2 fill-emerald-500 text-emerald-500" aria-hidden="true" />
        <span>Runtime connected</span>
      </div>
      <div className="flex items-center gap-4 whitespace-nowrap">
        <span>Schema v{version}</span>
        <span className="hidden sm:inline">Last modified {schema ? formatDateTime(schema.metadata.lastEditedAt) : "now"}</span>
      </div>
    </div>
  );
}

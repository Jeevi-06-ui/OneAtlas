"use client";

import { ChevronDown, FolderTree } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRuntimeIcon } from "@/components/runtime-renderer/icon-map";
import { cn } from "@/lib/utils";
import type { RuntimeSchema } from "@/types/runtime";

interface ComponentTreeProps {
  schema: RuntimeSchema;
  selectedId: string | null;
  onSelect: (componentId: string) => void;
}

export function ComponentTree({ schema, selectedId, onSelect }: ComponentTreeProps) {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <FolderTree className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold">Component tree</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{schema.sections.length} sections</p>
      </div>
      <div className="scrollbar-thin flex-1 overflow-auto p-3">
        {schema.sections.map((section) => (
          <div key={section.id} className="mb-3 rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">{section.title}</span>
              </div>
              <Badge variant="outline">{section.components.length}</Badge>
            </div>
            <div className="grid gap-1 p-2">
              {section.components.map((component) => {
                const Icon = getRuntimeIcon(
                  component.type === "chart"
                    ? "ChartNoAxesColumn"
                    : component.type === "table"
                      ? "Table2"
                      : component.type === "card"
                        ? "Sparkles"
                        : component.type === "form"
                          ? "Settings2"
                          : component.type === "activity"
                            ? "Bell"
                            : "Activity",
                );
                return (
                  <Button
                    key={component.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn("h-auto justify-start px-2 py-2 text-left", selectedId === component.id && "bg-muted text-foreground")}
                    onClick={() => onSelect(component.id)}
                  >
                    <Icon aria-hidden="true" />
                    <span className="truncate">{component.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

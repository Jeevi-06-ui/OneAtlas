"use client";

import { Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBuilderStore } from "@/store/builder-store";
import { findRuntimeComponent } from "@/utils/runtime-schema";
import type { ApiFailure, EditAppResponse } from "@/types/api";
import { toast } from "sonner";

export function PropertiesPanel() {
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const selectedId = useBuilderStore((state) => state.selectedComponentId);
  const updateComponent = useBuilderStore((state) => state.updateComponent);
  const setSchema = useBuilderStore((state) => state.setSchema);
  const component = findRuntimeComponent(schema, selectedId);

  async function handleSave() {
    if (!schema || !appId) {
      toast.error("No runtime schema is available to save.");
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schema),
      });
      const payload = (await response.json()) as EditAppResponse | ApiFailure;

      if (!response.ok || (payload && "error" in payload)) {
        const message = payload && "error" in payload ? payload.error.message : "Save failed.";
        throw new Error(message);
      }

      setSchema(payload.schema, payload.newVersion);
      toast.success(payload.mutationSummary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save runtime changes.");
    }
  }

  return (
    <aside className="flex h-full flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Settings2 className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-semibold">Properties</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Edit selected runtime component.</p>
      </div>
      <div className="scrollbar-thin flex-1 overflow-auto p-4">
        {!component ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Select a component on the canvas to edit its schema properties.
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{component.title}</p>
                <p className="text-xs text-muted-foreground">{component.id}</p>
              </div>
              <Badge variant="outline">{component.type}</Badge>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="component-title">Title</Label>
              <Input
                id="component-title"
                value={component.title}
                onChange={(event) =>
                  updateComponent(component.id, (current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="component-description">Description</Label>
              <Textarea
                id="component-description"
                value={component.description ?? ""}
                onChange={(event) =>
                  updateComponent(component.id, (current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            {component.type === "metric" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="metric-value">Metric value</Label>
                  <Input
                    id="metric-value"
                    value={component.value}
                    onChange={(event) =>
                      updateComponent(component.id, (current) =>
                        current.type === "metric" ? { ...current, value: event.target.value } : current,
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="metric-trend">Trend</Label>
                  <Input
                    id="metric-trend"
                    value={component.trend}
                    onChange={(event) =>
                      updateComponent(component.id, (current) =>
                        current.type === "metric" ? { ...current, trend: event.target.value } : current,
                      )
                    }
                  />
                </div>
              </>
            ) : null}

            {component.type === "card" ? (
              <div className="grid gap-2">
                <Label htmlFor="card-content">Content</Label>
                <Textarea
                  id="card-content"
                  value={component.content}
                  onChange={(event) =>
                    updateComponent(component.id, (current) =>
                      current.type === "card" ? { ...current, content: event.target.value } : current,
                    )
                  }
                />
              </div>
            ) : null}

            {component.type === "table" ? (
              <div className="grid gap-2">
                <p className="text-sm font-medium">Columns</p>
                <div className="grid gap-2">
                  {component.columns.map((column) => (
                    <div key={column.key} className="rounded-md border border-border p-3">
                      <p className="text-sm font-medium">{column.label}</p>
                      <p className="text-xs text-muted-foreground">{column.key} · {column.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {component.type === "form" ? (
              <div className="grid gap-2">
                <p className="text-sm font-medium">Fields</p>
                <div className="grid gap-2">
                  {component.fields.map((field) => (
                    <div key={field.id} className="rounded-md border border-border p-3">
                      <p className="text-sm font-medium">{field.label}</p>
                      <p className="text-xs text-muted-foreground">{field.name} · {field.fieldType}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <Button type="button" onClick={handleSave} className="w-full">
              Save Runtime Changes
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

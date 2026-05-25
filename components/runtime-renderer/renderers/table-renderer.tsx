"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RendererFrame } from "@/components/runtime-renderer/renderer-frame";
import type { RuntimePrimitive, RuntimeTableComponent } from "@/types/runtime";
import type { RuntimeRenderContext } from "@/types/runtime-render";

interface TableRendererProps {
  component: RuntimeTableComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
  context?: RuntimeRenderContext;
}

function formatCell(value: RuntimePrimitive, columnType: string) {
  if (value === null) {
    return "";
  }

  if (columnType === "currency" && typeof value === "number") {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (columnType === "number" && typeof value === "number") {
    return new Intl.NumberFormat("en").format(value);
  }

  return String(value);
}

export function TableRenderer({ component, selected, onSelect, context }: TableRendererProps) {
  return (
    <RendererFrame id={component.id} selected={selected} onSelect={onSelect}>
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>{component.title}</CardTitle>
            {component.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{component.description}</p>
            ) : null}
          </div>
          {component.primaryAction ? (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                context?.actions?.onTableAction?.(
                  component.primaryAction ?? "Add",
                  component.id,
                  component.title,
                );
              }}
            >
              {component.primaryAction}
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {component.columns.map((column) => (
                  <th key={column.key} className="px-3 py-2 font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {component.rows.map((row, index) => (
                <tr key={index} className="border-b border-border last:border-b-0">
                  {component.columns.map((column) => (
                    <td key={column.key} className="px-3 py-3">
                      {column.type === "status" ? (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs">
                          {formatCell(row[column.key], column.type)}
                        </span>
                      ) : (
                        formatCell(row[column.key], column.type)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </RendererFrame>
  );
}

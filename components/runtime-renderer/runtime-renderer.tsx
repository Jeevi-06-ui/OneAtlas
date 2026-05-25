"use client";

import { runtimeComponentRegistry } from "@/components/runtime-renderer/component-registry";
import { cn } from "@/lib/utils";
import type { RuntimeSchema, RuntimeSection } from "@/types/runtime";
import type { RuntimeRenderContext } from "@/types/runtime-render";

interface RuntimeRendererProps {
  schema: RuntimeSchema;
  selectedId?: string | null;
  onSelect?: (componentId: string) => void;
  previewMode?: boolean;
  renderContext?: RuntimeRenderContext;
}

const columnClasses: Record<NonNullable<RuntimeSection["columns"]>, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function RuntimeRenderer({ schema, selectedId, onSelect, previewMode, renderContext }: RuntimeRendererProps) {
  const context: RuntimeRenderContext = renderContext ?? { selectedId, onSelect, interactive: !previewMode };
  return (
    <div className={cn("mx-auto grid w-full max-w-6xl gap-6", previewMode && "max-w-7xl")}>
      {schema.sections.map((section) => (
        <section key={section.id} id={section.id} className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            ) : null}
          </div>
          <div
            className={cn(
              "grid gap-4",
              section.layout === "stack" ? "grid-cols-1" : "md:grid-cols-2",
              columnClasses[section.columns ?? 2],
            )}
          >
            {[...section.components]
              .sort((left, right) => left.order - right.order)
              .map((component) => (
                <div
                  key={component.id}
                  className={cn(
                    component.width === "full" && "md:col-span-2 lg:col-span-full",
                    component.width === "half" && "lg:col-span-2",
                  )}
                >
                  {runtimeComponentRegistry[component.type].render(component, {
                    ...context,
                    selectedId: context.selectedId ?? selectedId,
                    onSelect: context.onSelect ?? onSelect,
                  })}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export { runtimeComponentRegistry };

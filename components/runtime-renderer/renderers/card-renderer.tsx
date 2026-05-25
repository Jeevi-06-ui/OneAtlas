"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RendererFrame } from "@/components/runtime-renderer/renderer-frame";
import { cn } from "@/lib/utils";
import type { RuntimeCardComponent } from "@/types/runtime";
import type { RuntimeRenderContext } from "@/types/runtime-render";

const toneClasses: Record<RuntimeCardComponent["tone"], string> = {
  neutral: "from-slate-500/10",
  sky: "from-sky-500/10",
  emerald: "from-emerald-500/10",
  amber: "from-amber-500/10",
  rose: "from-rose-500/10",
  violet: "from-violet-500/10",
};

interface CardRendererProps {
  component: RuntimeCardComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
  context?: RuntimeRenderContext;
}

export function CardRenderer({ component, selected, onSelect, context }: CardRendererProps) {
  return (
    <RendererFrame id={component.id} selected={selected} onSelect={onSelect}>
      <Card className={cn("bg-gradient-to-br to-card", toneClasses[component.tone])}>
        <CardHeader>
          <CardTitle>{component.title}</CardTitle>
          {component.description ? (
            <p className="text-sm text-muted-foreground">{component.description}</p>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{component.content}</p>
        </CardContent>
        {component.actions?.length ? (
          <CardFooter className="gap-2">
            {component.actions.map((action) => (
              <Button
                key={action.id}
                type="button"
                size="sm"
                variant={action.intent === "primary" ? "default" : "outline"}
                onClick={(event) => {
                  event.stopPropagation();
                  context?.actions?.onCardAction?.(action.label, component.id, component.title);
                }}
              >
                {action.label}
              </Button>
            ))}
          </CardFooter>
        ) : null}
      </Card>
    </RendererFrame>
  );
}

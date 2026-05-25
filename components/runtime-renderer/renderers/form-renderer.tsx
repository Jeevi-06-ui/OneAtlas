"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RendererFrame } from "@/components/runtime-renderer/renderer-frame";
import type { RuntimeFormComponent } from "@/types/runtime";
import type { RuntimeRenderContext } from "@/types/runtime-render";

interface FormRendererProps {
  component: RuntimeFormComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
  context?: RuntimeRenderContext;
}

export function FormRenderer({ component, selected, onSelect, context }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const interactive = context?.interactive ?? false;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    const missing = component.fields.filter((field) => field.required && !values[field.name]?.trim());
    if (missing.length > 0) {
      toast.error(`Fill required fields: ${missing.map((field) => field.label).join(", ")}`);
      return;
    }

    context?.actions?.onFormSubmit?.(component.id, values);
  }

  return (
    <RendererFrame id={component.id} selected={selected} onSelect={onSelect}>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{component.title}</CardTitle>
            {component.description ? (
              <p className="text-sm text-muted-foreground">{component.description}</p>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {component.fields.map((field) => (
              <div key={field.id} className={field.fieldType === "textarea" ? "md:col-span-2" : ""}>
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </Label>
                {field.fieldType === "textarea" ? (
                  <Textarea
                    id={field.id}
                    className="mt-2 min-h-20"
                    placeholder={field.placeholder}
                    readOnly={!interactive}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.name]: event.target.value }))
                    }
                  />
                ) : (
                  <Input
                    id={field.id}
                    className="mt-2"
                    placeholder={field.placeholder}
                    readOnly={!interactive}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.name]: event.target.value }))
                    }
                  />
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit">{component.submitLabel}</Button>
          </CardFooter>
        </form>
      </Card>
    </RendererFrame>
  );
}

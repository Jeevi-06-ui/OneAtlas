"use client";

import { Eye, Filter, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { getTemplateBySlug } from "@/data/templates";
import { TemplateLaunchButton } from "@/components/templates/template-launch-button";
import { RuntimeAppShell } from "@/components/runtime-renderer";
import { createPreviewRuntimeActions } from "@/lib/preview-runtime-actions";
import type { TemplateConfig, TemplateComplexity } from "@/types/template";

interface TemplateBrowserProps {
  templates: TemplateConfig[];
}

const ALL = "all";

export function TemplateBrowser({ templates }: TemplateBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const activeCategory = searchParams.get("category") ?? ALL;
  const activeComplexity = searchParams.get("complexity") ?? ALL;
  const query = searchParams.get("q") ?? "";
  const selectedTemplate = selectedSlug ? getTemplateBySlug(selectedSlug) : undefined;

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(templates.map((template) => template.category)))],
    [templates],
  );
  const complexities: Array<TemplateComplexity | typeof ALL> = [ALL, "Starter", "Growth", "Advanced"];

  const filtered = templates.filter((template) => {
    const categoryMatch = activeCategory === ALL || template.category === activeCategory;
    const complexityMatch = activeComplexity === ALL || template.complexity === activeComplexity;
    const queryMatch =
      query.length === 0 ||
      [template.name, template.description, template.category, template.complexity, ...template.tags]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatch && complexityMatch && queryMatch;
  });

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === ALL || value.length === 0) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <>
      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium">Template library</p>
            <p className="text-sm text-muted-foreground">Filter by category, complexity, or prompt-domain keyword.</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setParam("q", event.target.value)}
              placeholder="Search templates"
              className="pl-9"
              aria-label="Search templates"
            />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setParam("category", category)}
              >
                {category === ALL ? "All categories" : category}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {complexities.map((complexity) => (
              <Button
                key={complexity}
                type="button"
                size="sm"
                variant={activeComplexity === complexity ? "default" : "outline"}
                onClick={() => setParam("complexity", complexity)}
              >
                {complexity === ALL ? "All complexity" : complexity}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No templates matched"
          description="Adjust the filters or search for CRM, HR, admin, analytics, inventory, or support."
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => (
            <Card key={template.id} className="flex min-h-72 flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription className="mt-2">{template.category}</CardDescription>
                  </div>
                  <Badge variant={template.complexity === "Advanced" ? "default" : "secondary"}>
                    {template.complexity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <TemplateLaunchButton template={template} label="Use Template" />
                <Button type="button" variant="outline" onClick={() => setSelectedSlug(template.slug)}>
                  <Eye aria-hidden="true" />
                  Preview
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedTemplate)} onOpenChange={(open) => !open && setSelectedSlug(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTemplate ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="mt-1 font-medium">{selectedTemplate.category}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Complexity</p>
                  <p className="mt-1 font-medium">{selectedTemplate.complexity}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground">Sections</p>
                  <p className="mt-1 font-medium">{selectedTemplate.schemaDefaults.sections.length}</p>
                </div>
              </div>
              <RuntimeAppShell
                schema={selectedTemplate.schemaDefaults}
                previewMode
                renderActions={createPreviewRuntimeActions()}
              />
              <DialogFooter>
                <TemplateLaunchButton template={selectedTemplate} label="Use Template" />
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

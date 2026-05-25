"use client";

import { useCallback, useMemo, useState } from "react";

import { RuntimeRenderer } from "@/components/runtime-renderer/runtime-renderer";
import { RuntimeSidebar } from "@/components/runtime-renderer/runtime-sidebar";
import { Badge } from "@/components/ui/badge";
import { getRuntimeAccentClasses } from "@/lib/runtime-theme";
import { scrollToHash } from "@/lib/widget-actions";
import { cn } from "@/lib/utils";
import type { RuntimeSchema } from "@/types/runtime";
import type { RuntimeRenderActions, RuntimeRenderContext } from "@/types/runtime-render";

interface RuntimeAppShellProps {
  schema: RuntimeSchema;
  selectedId?: string | null;
  onSelect?: (componentId: string) => void;
  previewMode?: boolean;
  showBuilderChrome?: boolean;
  renderActions?: RuntimeRenderActions;
}

export function RuntimeAppShell({
  schema,
  selectedId,
  onSelect,
  previewMode,
  showBuilderChrome = false,
  renderActions,
}: RuntimeAppShellProps) {
  const accent = getRuntimeAccentClasses(schema.theme.accent);
  const defaultNavId = schema.sidebar.groups[0]?.items[0]?.id ?? schema.navigation[0]?.id ?? null;
  const [activeNavId, setActiveNavId] = useState<string | null>(defaultNavId);
  const sidebarItems = useMemo(
    () => schema.sidebar.groups.flatMap((group) => group.items),
    [schema.sidebar.groups],
  );

  const focusSectionForNav = useCallback(
    (navId: string, href?: string) => {
      setActiveNavId(navId);
      if (href && scrollToHash(href)) {
        renderActions?.onNavSelect?.(href);
        return;
      }
      const itemIndex = sidebarItems.findIndex((item) => item.id === navId);
      const section = schema.sections[itemIndex] ?? schema.sections[0];
      if (section) {
        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      renderActions?.onNavSelect?.(href);
    },
    [renderActions, schema.sections, sidebarItems],
  );

  const renderContext: RuntimeRenderContext = {
    selectedId,
    onSelect,
    actions: renderActions,
    interactive: !previewMode && Boolean(renderActions),
  };

  const componentCount = useMemo(
    () => schema.sections.reduce((total, section) => total + section.components.length, 0),
    [schema.sections],
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card/90 shadow-lg",
        accent.border,
        accent.glow,
        previewMode ? "shadow-2xl" : "shadow-md",
      )}
      data-runtime-accent={schema.theme.accent}
      data-template-slug={schema.templateSlug}
    >
      <header className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3", accent.border)}>
        <div>
          <p className="text-sm font-semibold">{schema.appName}</p>
          <p className="text-xs text-muted-foreground">
            {schema.metadata.generatedFrom.length > 64
              ? `${schema.metadata.generatedFrom.slice(0, 64)}…`
              : schema.metadata.generatedFrom}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={accent.badge} variant="secondary">
            {schema.theme.accent} theme
          </Badge>
          <Badge variant="outline">{schema.sections.length} sections</Badge>
          <Badge variant="outline">{componentCount} widgets</Badge>
          {showBuilderChrome ? <Badge variant="outline">{schema.metadata.status}</Badge> : null}
        </div>
      </header>

      {schema.navigation.length > 0 ? (
        <div className={cn("flex flex-wrap gap-2 border-b border-border px-4 py-2", accent.border)}>
          {schema.navigation.map((item) => {
            const isActive = item.id === activeNavId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => focusSectionForNav(item.id, item.href)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground",
                  isActive && accent.navActive,
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid min-h-[520px] lg:grid-cols-[220px_minmax(0,1fr)]">
        <RuntimeSidebar
          schema={schema}
          activeNavId={activeNavId}
          onNavSelect={(itemId) => focusSectionForNav(itemId)}
          className="hidden lg:flex"
        />
        <main className="bg-background p-4 sm:p-6">
          <RuntimeRenderer
            schema={schema}
            selectedId={selectedId}
            onSelect={onSelect}
            previewMode={previewMode}
            renderContext={renderContext}
          />
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

import { BuilderTopbar } from "@/components/builder/builder-topbar";
import { ComponentTree } from "@/components/builder/component-tree";
import { ConversationStrip } from "@/components/builder/conversation-strip";
import { PropertiesPanel } from "@/components/builder/properties-panel";
import { StatusBar } from "@/components/builder/status-bar";
import { RuntimeAppShell } from "@/components/runtime-renderer";
import { Badge } from "@/components/ui/badge";
import { useBuilderStore } from "@/store/builder-store";
import type { RuntimeSchema } from "@/types/runtime";

interface BuilderShellProps {
  appId: string;
  initialSchema: RuntimeSchema;
  currentVersion: number;
}

export function BuilderShell({ appId, initialSchema, currentVersion }: BuilderShellProps) {
  const initializeBuilder = useBuilderStore((state) => state.initializeBuilder);
  const schema = useBuilderStore((state) => state.schema);
  const selectedId = useBuilderStore((state) => state.selectedComponentId);
  const selectComponent = useBuilderStore((state) => state.selectComponent);
  const leftPanelOpen = useBuilderStore((state) => state.leftPanelOpen);
  const rightPanelOpen = useBuilderStore((state) => state.rightPanelOpen);

  useEffect(() => {
    initializeBuilder({ appId, schema: initialSchema, version: currentVersion });
  }, [appId, currentVersion, initialSchema, initializeBuilder]);

  const activeSchema = schema ?? initialSchema;

  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:min-h-[720px] lg:overflow-hidden">
      <BuilderTopbar />
      <div className="grid flex-1 lg:min-h-0 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        {leftPanelOpen ? (
          <div className="order-2 min-h-72 w-full lg:order-1 lg:min-h-0 lg:w-72">
            <ComponentTree schema={activeSchema} selectedId={selectedId} onSelect={selectComponent} />
          </div>
        ) : null}

        <main className="runtime-grid order-1 bg-background p-4 sm:p-6 lg:order-2 lg:min-h-0 lg:overflow-auto">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/90 p-3 shadow-sm">
            <div>
              <p className="text-sm font-medium">Runtime canvas</p>
              <p className="text-xs text-muted-foreground">
                Template-driven app shell with sidebar, navigation, and schema widgets.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{activeSchema.templateSlug}</Badge>
              <Badge variant="outline">{activeSchema.metadata.ownerRole}</Badge>
            </div>
          </div>
          <RuntimeAppShell
            schema={activeSchema}
            selectedId={selectedId}
            onSelect={selectComponent}
            showBuilderChrome
          />
        </main>

        {rightPanelOpen ? (
          <div className="order-3 min-h-72 w-full lg:min-h-0 lg:w-80">
            <PropertiesPanel />
          </div>
        ) : null}
      </div>
      <ConversationStrip />
      <StatusBar />
    </div>
  );
}

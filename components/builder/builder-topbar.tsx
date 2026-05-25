"use client";

import { Copy, Eye, PanelLeftClose, PanelRightClose, Rocket, RotateCcw, Share2 } from "lucide-react";
import { toast } from "sonner";

import { CommandPalette } from "@/components/ui/command-palette";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderActions } from "@/hooks/use-builder-actions";
import { useBuilderStore } from "@/store/builder-store";
import type { ApiFailure, EditAppResponse, PreviewSnapshotResponse } from "@/types/api";

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function BuilderTopbar() {
  const appId = useBuilderStore((state) => state.appId);
  const appName = useBuilderStore((state) => state.appName);
  const setAppName = useBuilderStore((state) => state.setAppName);
  const version = useBuilderStore((state) => state.version);
  const setSchema = useBuilderStore((state) => state.setSchema);
  const previewUrl = useBuilderStore((state) => state.previewUrl);
  const setPreviewUrl = useBuilderStore((state) => state.setPreviewUrl);
  const isCreatingPreview = useBuilderStore((state) => state.isCreatingPreview);
  const setIsCreatingPreview = useBuilderStore((state) => state.setIsCreatingPreview);
  const leftPanelOpen = useBuilderStore((state) => state.leftPanelOpen);
  const rightPanelOpen = useBuilderStore((state) => state.rightPanelOpen);
  const setLeftPanelOpen = useBuilderStore((state) => state.setLeftPanelOpen);
  const setRightPanelOpen = useBuilderStore((state) => state.setRightPanelOpen);
  const undoLocalHistory = useBuilderStore((state) => state.undoLocalHistory);
  const { exportSchema, shareBuilderLink, saveAppName } = useBuilderActions();

  async function createPreview() {
    if (!appId) {
      return;
    }

    if (appId.startsWith("demo-")) {
      toast.info("Generate a persisted app to create database-backed frozen previews.");
      return;
    }

    setIsCreatingPreview(true);
    try {
      const response = await fetch(`/api/apps/${appId}/preview`, { method: "POST" });
      const payload = (await response.json()) as PreviewSnapshotResponse | ApiFailure;

      if (!response.ok || isApiFailure(payload)) {
        throw new Error(isApiFailure(payload) ? payload.error.message : "Preview creation failed.");
      }

      setPreviewUrl(payload.previewUrl);
      await navigator.clipboard.writeText(payload.previewUrl);
      toast.success("Frozen preview created and copied");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create preview.");
    } finally {
      setIsCreatingPreview(false);
    }
  }

  async function undo() {
    if (!appId) {
      return;
    }

    if (appId.startsWith("demo-")) {
      const restored = undoLocalHistory();
      if (restored) {
        toast.success(`Restored local schema v${restored.version}`);
      } else {
        toast.info("No local edit history yet.");
      }
      return;
    }

    try {
      const response = await fetch(`/api/apps/${appId}/undo`, { method: "POST" });
      const payload = (await response.json()) as EditAppResponse | ApiFailure;
      if (!response.ok || isApiFailure(payload)) {
        throw new Error(isApiFailure(payload) ? payload.error.message : "Undo failed.");
      }

      setSchema(payload.schema, payload.newVersion);
      toast.success(payload.mutationSummary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not undo.");
    }
  }

  async function copyPreview() {
    if (!previewUrl) {
      await createPreview();
      return;
    }
    await navigator.clipboard.writeText(previewUrl);
    toast.success("Preview link copied");
  }

  async function handleShare() {
    if (previewUrl) {
      await navigator.clipboard.writeText(previewUrl);
      toast.success("Preview link copied to clipboard");
      return;
    }
    await shareBuilderLink();
  }

  return (
    <div className="flex min-h-16 flex-col gap-3 border-b border-border bg-card px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Button type="button" variant="ghost" size="icon" onClick={() => setLeftPanelOpen(!leftPanelOpen)} aria-label="Toggle component tree">
          <PanelLeftClose aria-hidden="true" />
        </Button>
        <Input
          value={appName}
          onChange={(event) => setAppName(event.target.value)}
          onBlur={() => void saveAppName()}
          className="h-9 max-w-sm border-transparent bg-muted/70 font-medium"
          aria-label="App name"
        />
        <Badge variant="outline">v{version}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CommandPalette
          commands={[
            {
              id: "preview",
              label: "Create preview",
              description: "Freeze the current schema into a tokenized preview link.",
              onSelect: createPreview,
            },
            {
              id: "share",
              label: "Share app",
              description: "Copy preview link or builder URL.",
              onSelect: handleShare,
            },
            {
              id: "export",
              label: "Export schema",
              description: "Download the current runtime schema as JSON.",
              onSelect: exportSchema,
            },
            {
              id: "undo",
              label: "Undo",
              description: "Restore the previous persisted schema snapshot.",
              onSelect: undo,
            },
          ]}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => void undo()}>
          <RotateCcw aria-hidden="true" />
          Undo
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => void handleShare()}>
          <Share2 aria-hidden="true" />
          Share
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => void createPreview()} disabled={isCreatingPreview}>
          <Eye aria-hidden="true" />
          {isCreatingPreview ? "Freezing" : "Preview"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => void copyPreview()}>
          <Copy aria-hidden="true" />
          Copy
        </Button>
        <Button type="button" size="sm" onClick={() => exportSchema()}>
          <Rocket aria-hidden="true" />
          Deploy
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setRightPanelOpen(!rightPanelOpen)} aria-label="Toggle properties panel">
          <PanelRightClose aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

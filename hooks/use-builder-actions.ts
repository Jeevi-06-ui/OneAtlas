"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { buildCardActionInstruction, buildTableActionInstruction, scrollToHash } from "@/lib/widget-actions";
import { useBuilderStore } from "@/store/builder-store";
import type { ApiFailure, EditAppResponse } from "@/types/api";

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function useBuilderActions() {
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const setSchema = useBuilderStore((state) => state.setSchema);
  const selectComponent = useBuilderStore((state) => state.selectComponent);
  const pushLocalHistory = useBuilderStore((state) => state.pushLocalHistory);

  const applyInstruction = useCallback(
    async (instruction: string) => {
      if (!schema || !appId) {
        return;
      }

      if (appId.startsWith("demo-")) {
        const { parseMutationInstruction } = await import("@/services/mutation-parser");
        const { applyRuntimeMutation } = await import("@/services/mutation-engine");
        const parsed = parseMutationInstruction(instruction, schema);
        const applied = applyRuntimeMutation(schema, parsed.mutation);
        pushLocalHistory(applied.schema);
        setSchema(applied.schema, applied.schema.version);
        toast.success(applied.result.schemaSummary);
        return;
      }

      const response = await fetch(`/api/apps/${appId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      const payload = (await response.json()) as EditAppResponse | ApiFailure;
      if (!response.ok || isApiFailure(payload)) {
        throw new Error(isApiFailure(payload) ? payload.error.message : "Action failed.");
      }
      pushLocalHistory(payload.schema);
      setSchema(payload.schema, payload.newVersion);
      toast.success(payload.mutationSummary);
    },
    [appId, pushLocalHistory, schema, setSchema],
  );

  const handleTableAction = useCallback(
    async (actionLabel: string, componentId: string, tableTitle: string) => {
      selectComponent(componentId);
      try {
        await applyInstruction(buildTableActionInstruction(actionLabel, tableTitle));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Table action failed.");
      }
    },
    [applyInstruction, selectComponent],
  );

  const handleCardAction = useCallback(
    async (actionLabel: string, componentId: string, cardTitle: string) => {
      selectComponent(componentId);
      if (scrollToHash(`#${cardTitle.toLowerCase().replace(/\s+/g, "-")}`)) {
        toast.success(`Opened ${cardTitle}`);
        return;
      }
      try {
        await applyInstruction(buildCardActionInstruction(actionLabel, cardTitle));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Card action failed.");
      }
    },
    [applyInstruction, selectComponent],
  );

  const handleFormSubmit = useCallback(
    async (componentId: string, values: Record<string, string>) => {
      selectComponent(componentId);
      const filled = Object.values(values).filter((value) => value.trim().length > 0).length;
      toast.success(`Form submitted with ${filled} field(s). Data is preview-only until connected to your API.`);
    },
    [selectComponent],
  );

  const handleActivityItem = useCallback((title: string, detail: string) => {
    toast.info(title, { description: detail });
  }, []);

  const handleNavSelect = useCallback((href?: string) => {
    if (scrollToHash(href)) {
      return;
    }
    toast.info("Section focused in canvas");
  }, []);

  const exportSchema = useCallback(() => {
    if (!schema) {
      toast.error("No schema to export.");
      return;
    }
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${schema.appName.replace(/\s+/g, "-").toLowerCase()}-schema-v${schema.version}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Schema exported as JSON");
  }, [schema]);

  const shareBuilderLink = useCallback(async () => {
    if (!appId || appId.startsWith("demo-")) {
      toast.info("Generate a persisted app before sharing the builder link.");
      return;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const url = `${base}/builder/${appId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Builder link copied");
  }, [appId]);

  const saveAppName = useCallback(async () => {
    const name = useBuilderStore.getState().appName.trim();
    if (!appId || appId.startsWith("demo-") || !name) {
      return;
    }
    const response = await fetch(`/api/apps/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const payload = (await response.json()) as { name: string } | ApiFailure;
    if (!response.ok || isApiFailure(payload)) {
      toast.error(isApiFailure(payload) ? payload.error.message : "Could not save app name.");
      return;
    }
    toast.success("App name saved");
  }, [appId]);

  return {
    applyInstruction,
    handleTableAction,
    handleCardAction,
    handleFormSubmit,
    handleActivityItem,
    handleNavSelect,
    exportSchema,
    shareBuilderLink,
    saveAppName,
  };
}

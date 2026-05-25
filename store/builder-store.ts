"use client";

import { create } from "zustand";

import { createBuilderSlice } from "@/store/slices/builder-slice";
import { createHistorySlice } from "@/store/slices/history-slice";
import { createPreviewSlice } from "@/store/slices/preview-slice";
import { createSchemaSlice } from "@/store/slices/schema-slice";
import { createSelectedComponentSlice } from "@/store/slices/selected-component-slice";
import { createUiSlice } from "@/store/slices/ui-slice";
import type { BuilderStore } from "@/store/types";

export const useBuilderStore = create<BuilderStore>()((...args) => ({
  ...createBuilderSlice(...args),
  ...createSelectedComponentSlice(...args),
  ...createSchemaSlice(...args),
  ...createHistorySlice(...args),
  ...createPreviewSlice(...args),
  ...createUiSlice(...args),
}));

export const useRuntimeSchema = () => useBuilderStore((state) => state.schema);
export const useSelectedComponentId = () =>
  useBuilderStore((state) => state.selectedComponentId);

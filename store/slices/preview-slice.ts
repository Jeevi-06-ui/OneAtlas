import type { StateCreator } from "zustand";

import type { BuilderStore, PreviewSlice } from "@/store/types";

export const createPreviewSlice: StateCreator<BuilderStore, [], [], PreviewSlice> = (set) => ({
  previewUrl: null,
  isCreatingPreview: false,
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setIsCreatingPreview: (isCreating) => set({ isCreatingPreview: isCreating }),
});

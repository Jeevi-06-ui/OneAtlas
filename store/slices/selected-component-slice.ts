import type { StateCreator } from "zustand";

import type { BuilderStore, SelectedComponentSlice } from "@/store/types";

export const createSelectedComponentSlice: StateCreator<
  BuilderStore,
  [],
  [],
  SelectedComponentSlice
> = (set) => ({
  selectedComponentId: null,
  selectComponent: (componentId) => set({ selectedComponentId: componentId }),
});

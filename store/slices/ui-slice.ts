import type { StateCreator } from "zustand";

import type { BuilderStore, UiSlice } from "@/store/types";

export const createUiSlice: StateCreator<BuilderStore, [], [], UiSlice> = (set) => ({
  leftPanelOpen: true,
  rightPanelOpen: true,
  isEditing: false,
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setIsEditing: (isEditing) => set({ isEditing }),
});

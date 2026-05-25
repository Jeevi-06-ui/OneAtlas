import type { StateCreator } from "zustand";

import type { BuilderStore, HistorySlice } from "@/store/types";
import type { RuntimeSchema } from "@/types/runtime";

export const createHistorySlice: StateCreator<BuilderStore, [], [], HistorySlice> = (set, get) => ({
  localHistory: [],
  pushLocalHistory: (schema: RuntimeSchema) =>
    set((state) => ({
      localHistory: [...state.localHistory, schema].slice(-25),
    })),
  undoLocalHistory: () => {
    const history = get().localHistory;
    if (history.length < 2) {
      return null;
    }

    const nextHistory = history.slice(0, -1);
    const restored = nextHistory[nextHistory.length - 1] ?? null;
    set({
      localHistory: nextHistory,
      schema: restored,
      version: restored?.version ?? get().version,
    });

    return restored;
  },
  clearLocalHistory: () => set({ localHistory: [] }),
});

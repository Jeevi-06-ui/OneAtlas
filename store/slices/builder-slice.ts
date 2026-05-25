import type { StateCreator } from "zustand";

import type { BuilderSlice, BuilderStore } from "@/store/types";

export const createBuilderSlice: StateCreator<BuilderStore, [], [], BuilderSlice> = (set) => ({
  appId: null,
  appName: "",
  version: 1,
  initializeBuilder: ({ appId, schema, version }) =>
    set({
      appId,
      appName: schema.appName,
      version,
      schema,
      selectedComponentId: schema.sections[0]?.components[0]?.id ?? null,
      localHistory: [schema],
    }),
  setAppName: (name) =>
    set((state) => ({
      appName: name,
      schema: state.schema
        ? {
            ...state.schema,
            appName: name,
            sidebar: {
              ...state.schema.sidebar,
              brand: name,
            },
          }
        : state.schema,
    })),
});

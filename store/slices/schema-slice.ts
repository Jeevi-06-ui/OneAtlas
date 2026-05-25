import type { StateCreator } from "zustand";

import { safeJsonClone } from "@/lib/utils";
import type { BuilderStore, SchemaSlice } from "@/store/types";
import type { RuntimeComponent, RuntimeSchema } from "@/types/runtime";

function updateComponentInSchema(
  schema: RuntimeSchema,
  componentId: string,
  updater: (component: RuntimeComponent) => RuntimeComponent,
) {
  const nextSchema = safeJsonClone(schema);

  nextSchema.sections = nextSchema.sections.map((section) => ({
    ...section,
    components: section.components.map((component) =>
      component.id === componentId ? updater(component) : component,
    ),
  }));
  nextSchema.metadata = {
    ...nextSchema.metadata,
    lastEditedAt: new Date().toISOString(),
  };

  return nextSchema;
}

export const createSchemaSlice: StateCreator<BuilderStore, [], [], SchemaSlice> = (set) => ({
  schema: null,
  setSchema: (schema, version) =>
    set({
      schema,
      appName: schema.appName,
      version: version ?? schema.version,
    }),
  updateComponent: (componentId, updater) =>
    set((state) => {
      if (!state.schema) {
        return {};
      }

      const nextSchema = updateComponentInSchema(state.schema, componentId, updater);
      return {
        schema: nextSchema,
      };
    }),
});

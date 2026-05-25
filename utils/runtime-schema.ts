import type { RuntimeComponent, RuntimeSchema } from "@/types/runtime";

export function findRuntimeComponent(schema: RuntimeSchema | null, componentId: string | null) {
  if (!schema || !componentId) {
    return undefined;
  }

  for (const section of schema.sections) {
    const component = section.components.find((item) => item.id === componentId);
    if (component) {
      return component;
    }
  }

  return undefined;
}

export function countRuntimeComponents(schema: RuntimeSchema) {
  return schema.sections.reduce((total, section) => total + section.components.length, 0);
}

export function getComponentLabel(component: RuntimeComponent) {
  return `${component.title} · ${component.type}`;
}

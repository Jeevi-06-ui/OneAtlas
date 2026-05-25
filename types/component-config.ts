import type { RuntimeComponent, RuntimeComponentType } from "@/types/runtime";

export interface ComponentRegistryItem {
  type: RuntimeComponentType;
  label: string;
  description: string;
  defaultWidth: RuntimeComponent["width"];
}

export interface PropertyControlConfig {
  id: string;
  label: string;
  control: "text" | "textarea" | "select" | "number";
  path: string;
}

import type { RuntimeSchema } from "@/types/runtime";

export type TemplateCategory =
  | "Sales"
  | "People Ops"
  | "Operations"
  | "Platform"
  | "Data"
  | "Supply Chain"
  | "Customer Ops";

export type TemplateComplexity = "Starter" | "Growth" | "Advanced";

export interface TemplateConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  tags: string[];
  keywords: string[];
  schemaDefaults: RuntimeSchema;
  parentTemplateId?: string;
  createdAt: string;
}

export interface TemplateCardView {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  tags: string[];
}

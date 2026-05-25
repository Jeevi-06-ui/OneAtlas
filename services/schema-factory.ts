import { nanoid } from "nanoid";

import { safeJsonClone, slugify, titleCase } from "@/lib/utils";
import type { RuntimeSchema } from "@/types/runtime";
import type { TemplateConfig } from "@/types/template";

const RESERVED_WORDS = new Set([
  "build",
  "create",
  "make",
  "need",
  "want",
  "with",
  "for",
  "that",
  "from",
  "using",
  "dashboard",
  "workspace",
  "system",
  "app",
]);

function generateName(prompt: string, template: TemplateConfig) {
  const meaningfulWords = prompt
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase())
    .filter((word) => word.length > 2 && !RESERVED_WORDS.has(word))
    .slice(0, 4);

  if (meaningfulWords.length === 0) {
    return `${template.name} Runtime`;
  }

  return `${titleCase(meaningfulWords.join(" "))} ${template.category} Runtime`;
}

export function instantiateSchema(template: TemplateConfig, prompt: string) {
  const schema = safeJsonClone(template.schemaDefaults);
  const generatedName = generateName(prompt, template);
  const now = new Date().toISOString();

  const instantiated: RuntimeSchema = {
    ...schema,
    id: `schema_${nanoid(10)}`,
    appName: generatedName,
    templateSlug: template.slug,
    version: 1,
    theme: { ...schema.theme },
    sidebar: {
      ...schema.sidebar,
      brand: generatedName,
      groups: schema.sidebar.groups.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item })),
      })),
    },
    navigation: schema.navigation.map((item) => ({ ...item })),
    sections: schema.sections.map((section) => ({
      ...section,
      components: section.components.map((component) => ({ ...component })),
    })),
    metadata: {
      ...schema.metadata,
      generatedFrom: prompt,
      ownerRole: schema.metadata.ownerRole,
      status: "draft",
      lastEditedAt: now,
    },
  };

  return {
    generatedName,
    slug: slugify(generatedName),
    schema: instantiated,
  };
}

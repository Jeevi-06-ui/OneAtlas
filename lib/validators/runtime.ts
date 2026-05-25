import { z } from "zod";

const runtimeToneSchema = z.enum([
  "neutral",
  "sky",
  "emerald",
  "amber",
  "rose",
  "violet",
]);

const baseComponentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  width: z.enum(["full", "half", "third"]).optional(),
  locked: z.boolean().optional(),
});

const primitiveValue = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const metricComponentSchema = baseComponentSchema.extend({
  type: z.literal("metric"),
  value: z.string(),
  trend: z.string(),
  tone: runtimeToneSchema,
  icon: z.string(),
});

const chartComponentSchema = baseComponentSchema.extend({
  type: z.literal("chart"),
  chartType: z.enum(["bar", "line", "area", "donut"]),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      comparison: z.number().optional(),
    }),
  ),
  tone: runtimeToneSchema,
});

const tableComponentSchema = baseComponentSchema.extend({
  type: z.literal("table"),
  columns: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      type: z.enum(["text", "number", "currency", "date", "status", "email"]),
      sortable: z.boolean().optional(),
    }),
  ),
  rows: z.array(z.record(z.string(), primitiveValue)),
  primaryAction: z.string().optional(),
});

const formComponentSchema = baseComponentSchema.extend({
  type: z.literal("form"),
  fields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      label: z.string(),
      fieldType: z.enum(["text", "email", "number", "select", "textarea", "date"]),
      placeholder: z.string().optional(),
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
    }),
  ),
  submitLabel: z.string(),
});

const cardComponentSchema = baseComponentSchema.extend({
  type: z.literal("card"),
  content: z.string(),
  tone: runtimeToneSchema,
  actions: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        intent: z.enum(["primary", "secondary"]),
      }),
    )
    .optional(),
});

const activityComponentSchema = baseComponentSchema.extend({
  type: z.literal("activity"),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      detail: z.string(),
      timestamp: z.string(),
      tone: runtimeToneSchema.optional(),
    }),
  ),
});

export const runtimeComponentSchema = z.discriminatedUnion("type", [
  metricComponentSchema,
  chartComponentSchema,
  tableComponentSchema,
  formComponentSchema,
  cardComponentSchema,
  activityComponentSchema,
]);

export const runtimeSchemaValidator = z.object({
  id: z.string(),
  appName: z.string(),
  templateSlug: z.string(),
  version: z.number(),
  theme: z.object({
    mode: z.enum(["light", "dark", "system"]),
    accent: runtimeToneSchema,
    density: z.enum(["compact", "comfortable", "spacious"]),
    radius: z.enum(["sm", "md", "lg"]),
  }),
  sidebar: z.object({
    brand: z.string(),
    groups: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        items: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            href: z.string().optional(),
            icon: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
  navigation: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      href: z.string().optional(),
      icon: z.string().optional(),
    }),
  ),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      layout: z.enum(["grid", "stack", "split"]),
      columns: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      components: z.array(runtimeComponentSchema),
    }),
  ),
  metadata: z.object({
    generatedFrom: z.string(),
    ownerRole: z.string(),
    status: z.enum(["draft", "active", "preview"]),
    lastEditedAt: z.string(),
  }),
});

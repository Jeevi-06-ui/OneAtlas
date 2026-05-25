import { nanoid } from "nanoid";

import { slugify, titleCase } from "@/lib/utils";
import type { MutationParseResult, RuntimeMutation } from "@/types/mutation";
import type { RuntimeChartComponent, RuntimeSchema } from "@/types/runtime";

const FIELD_HINTS = ["field", "column", "property"];

function extractQuotedPair(instruction: string) {
  const quoted = Array.from(instruction.matchAll(/["']([^"']+)["']/g)).map((match) => match[1]);
  return quoted.length >= 2 ? { from: quoted[0], to: quoted[1] } : undefined;
}

function parseRename(instruction: string): RuntimeMutation | undefined {
  const quoted = extractQuotedPair(instruction);
  if (quoted) {
    return { type: "rename_field", from: quoted.from, to: quoted.to };
  }

  const match = instruction.match(/rename\s+(.+?)\s+(?:to|as)\s+(.+)$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "rename_field",
    from: match[1].trim(),
    to: match[2].trim(),
  };
}

function parseRemove(instruction: string): RuntimeMutation | undefined {
  const match = instruction.match(/(?:remove|delete)\s+(.+?)(?:\s+(?:field|column|property))?$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "remove_field",
    fieldName: match[1].trim(),
  };
}

function parseRemoveComponent(instruction: string): RuntimeMutation | undefined {
  const match = instruction.match(/(?:remove|delete)\s+(.+?)\s+component$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "remove_component",
    targetName: match[1].trim(),
  };
}

function parseRemoveSection(instruction: string): RuntimeMutation | undefined {
  const match = instruction.match(/(?:remove|delete)\s+(.+?)\s+section$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "remove_section",
    targetName: match[1].trim(),
  };
}

function parseReorder(instruction: string): RuntimeMutation | undefined {
  const match = instruction.match(/move\s+(.+?)\s+(?:section\s+)?(?:to\s+)?(top|bottom|first|last)$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "reorder_components",
    targetName: match[1].trim(),
    position: match[2].toLowerCase() === "bottom" || match[2].toLowerCase() === "last" ? "bottom" : "top",
  };
}

function buildRevenueChart(schema: RuntimeSchema, instruction: string): RuntimeChartComponent {
  const normalizedTitle = titleCase(
    instruction
      .replace(/add/i, "")
      .replace(/chart/i, "")
      .trim() || "Revenue",
  );

  return {
    id: `chart_${nanoid(8)}`,
    type: "chart",
    title: `${normalizedTitle} Chart`,
    description: "Added through conversational schema editing",
    chartType: "line",
    tone: schema.theme.accent,
    order: 99,
    width: "full",
    data: [
      { label: "W1", value: 18, comparison: 14 },
      { label: "W2", value: 28, comparison: 20 },
      { label: "W3", value: 35, comparison: 24 },
      { label: "W4", value: 48, comparison: 32 },
      { label: "W5", value: 57, comparison: 39 },
      { label: "W6", value: 71, comparison: 44 },
    ],
  };
}

function parseAdd(instruction: string, schema: RuntimeSchema): RuntimeMutation | undefined {
  if (!/^add\s+/i.test(instruction)) {
    return undefined;
  }

  if (/chart|graph|trend/i.test(instruction)) {
    return {
      type: "update_component_prop",
      prop: "append_component",
      value: instruction,
      component: buildRevenueChart(schema, instruction),
    };
  }

  const withoutVerb = instruction.replace(/^add\s+/i, "");
  const cleaned = FIELD_HINTS.reduce(
    (value, hint) => value.replace(new RegExp(`\\b${hint}\\b`, "gi"), ""),
    withoutVerb,
  );
  const label = titleCase(cleaned.trim() || "New Field");
  const key = slugify(label).replace(/-/g, "_");

  return {
    type: "add_field",
    targetKind: /form/i.test(instruction) ? "form" : /table|column/i.test(instruction) ? "table" : "both",
    field: {
      id: `field_${nanoid(8)}`,
      name: key,
      label,
      fieldType: /date/i.test(label) ? "date" : /email/i.test(label) ? "email" : "text",
      placeholder: `Enter ${label.toLowerCase()}`,
    },
    column: {
      key,
      label,
      type: /date/i.test(label) ? "date" : /email/i.test(label) ? "email" : "text",
      sortable: true,
    },
  };
}

function parseUpdate(instruction: string): RuntimeMutation | undefined {
  const match = instruction.match(/(?:update|change|set)\s+(.+?)\s+(title|description|content)\s+(?:to|as)\s+(.+)$/i);
  if (!match) {
    return undefined;
  }

  return {
    type: "update_component_prop",
    targetName: match[1].trim(),
    prop: match[2].toLowerCase() as "title" | "description" | "content",
    value: match[3].trim(),
  };
}

export function parseMutationInstruction(
  instruction: string,
  schema: RuntimeSchema,
): MutationParseResult {
  const trimmed = instruction.trim();
  const mutation =
    parseRename(trimmed) ??
    parseRemoveSection(trimmed) ??
    parseRemoveComponent(trimmed) ??
    parseRemove(trimmed) ??
    parseReorder(trimmed) ??
    parseAdd(trimmed, schema) ??
    parseUpdate(trimmed);

  if (!mutation) {
    throw new Error(
      "Unsupported mutation. Try adding a field or chart, renaming a field, removing a column, or moving a section.",
    );
  }

  return {
    mutation,
    matchedPhrase: trimmed,
  };
}

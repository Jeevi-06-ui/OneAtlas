import { runtimeSchemaValidator } from "@/lib/validators/runtime";
import { normalizeText, safeJsonClone } from "@/lib/utils";
import type { MutationApplyResult, RuntimeMutation } from "@/types/mutation";
import type {
  RuntimeComponent,
  RuntimeRecord,
  RuntimeSchema,
  RuntimeSection,
  RuntimeTableColumn,
} from "@/types/runtime";

function matches(value: string, query: string) {
  return normalizeText(value).includes(normalizeText(query));
}

function normalizeKey(value: string) {
  return normalizeText(value).replace(/\s+/g, "_").replace(/-/g, "_");
}

function sortComponents(section: RuntimeSection) {
  section.components = section.components
    .sort((left, right) => left.order - right.order)
    .map((component, index) => ({ ...component, order: index + 1 }));
}

function findFirstComponent<T extends RuntimeComponent["type"]>(
  schema: RuntimeSchema,
  type: T,
): Extract<RuntimeComponent, { type: T }> | undefined {
  for (const section of schema.sections) {
    const component = section.components.find((item) => item.type === type);
    if (component) {
      return component as Extract<RuntimeComponent, { type: T }>;
    }
  }

  return undefined;
}

function addField(schema: RuntimeSchema, mutation: Extract<RuntimeMutation, { type: "add_field" }>) {
  let changed = false;

  if (mutation.targetKind === "table" || mutation.targetKind === "both") {
    const table = findFirstComponent(schema, "table");
    if (table && !table.columns.some((column) => column.key === mutation.column.key)) {
      table.columns.push(mutation.column);
      table.rows = table.rows.map((row) => ({
        ...row,
        [mutation.column.key]: "",
      }));
      changed = true;
    }
  }

  if (mutation.targetKind === "form" || mutation.targetKind === "both") {
    const form = findFirstComponent(schema, "form");
    if (form && !form.fields.some((field) => field.name === mutation.field.name)) {
      form.fields.push(mutation.field);
      changed = true;
    }
  }

  return {
    changed,
    summary: changed
      ? `Added ${mutation.column.label} to ${mutation.targetKind === "both" ? "records and intake form" : mutation.targetKind}.`
      : `${mutation.column.label} already exists in the runtime schema.`,
  };
}

function removeField(schema: RuntimeSchema, mutation: Extract<RuntimeMutation, { type: "remove_field" }>) {
  let removed = 0;

  for (const section of schema.sections) {
    for (const component of section.components) {
      if (component.type === "table") {
        const removedColumns = component.columns.filter((column) => matches(column.label, mutation.fieldName));
        const removedKeys = new Set(removedColumns.map((column) => column.key));
        component.columns = component.columns.filter((column) => !removedKeys.has(column.key));
        component.rows = component.rows.map((row) => {
          const nextRow: RuntimeRecord = { ...row };
          for (const key of removedKeys) {
            Reflect.deleteProperty(nextRow, key);
          }
          return nextRow;
        });
        removed += removedColumns.length;
      }

      if (component.type === "form") {
        const before = component.fields.length;
        component.fields = component.fields.filter((field) => !matches(field.label, mutation.fieldName));
        removed += before - component.fields.length;
      }
    }
  }

  return {
    changed: removed > 0,
    summary: removed > 0 ? `Removed ${mutation.fieldName} from ${removed} schema location(s).` : `No field matched ${mutation.fieldName}.`,
  };
}

function removeComponent(
  schema: RuntimeSchema,
  mutation: Extract<RuntimeMutation, { type: "remove_component" }>,
) {
  for (const section of schema.sections) {
    const index = section.components.findIndex((component) => matches(component.title, mutation.targetName));
    if (index >= 0) {
      const [removed] = section.components.splice(index, 1);
      sortComponents(section);
      return {
        changed: true,
        summary: `Removed ${removed.title} from ${section.title}.`,
      };
    }
  }

  return {
    changed: false,
    summary: `No component matched ${mutation.targetName}.`,
  };
}

function removeSection(
  schema: RuntimeSchema,
  mutation: Extract<RuntimeMutation, { type: "remove_section" }>,
) {
  const index = schema.sections.findIndex((section) => matches(section.title, mutation.targetName));
  if (index >= 0) {
    const [removed] = schema.sections.splice(index, 1);
    return {
      changed: true,
      summary: `Removed ${removed.title} section.`,
    };
  }

  return {
    changed: false,
    summary: `No section matched ${mutation.targetName}.`,
  };
}

function renameField(schema: RuntimeSchema, mutation: Extract<RuntimeMutation, { type: "rename_field" }>) {
  let changed = 0;
  const nextKey = normalizeKey(mutation.to);

  for (const section of schema.sections) {
    if (matches(section.title, mutation.from)) {
      section.title = mutation.to;
      changed += 1;
    }

    for (const component of section.components) {
      if (matches(component.title, mutation.from)) {
        component.title = mutation.to;
        changed += 1;
      }

      if (component.type === "table") {
        const renamedColumns: RuntimeTableColumn[] = [];
        component.columns = component.columns.map((column) => {
          if (!matches(column.label, mutation.from)) {
            return column;
          }

          renamedColumns.push(column);
          changed += 1;
          return {
            ...column,
            key: nextKey,
            label: mutation.to,
          };
        });

        for (const column of renamedColumns) {
          component.rows = component.rows.map((row) => {
            const nextRow: RuntimeRecord = { ...row, [nextKey]: row[column.key] ?? "" };
            Reflect.deleteProperty(nextRow, column.key);
            return nextRow;
          });
        }
      }

      if (component.type === "form") {
        component.fields = component.fields.map((field) => {
          if (!matches(field.label, mutation.from)) {
            return field;
          }

          changed += 1;
          return {
            ...field,
            name: nextKey,
            label: mutation.to,
          };
        });
      }
    }
  }

  return {
    changed: changed > 0,
    summary: changed > 0 ? `Renamed ${mutation.from} to ${mutation.to} in ${changed} schema location(s).` : `No schema item matched ${mutation.from}.`,
  };
}

function reorderComponents(
  schema: RuntimeSchema,
  mutation: Extract<RuntimeMutation, { type: "reorder_components" }>,
) {
  const sectionIndex = schema.sections.findIndex((section) => matches(section.title, mutation.targetName));
  if (sectionIndex >= 0) {
    const [section] = schema.sections.splice(sectionIndex, 1);
    if (mutation.position === "top") {
      schema.sections.unshift(section);
    } else {
      schema.sections.push(section);
    }
    return {
      changed: true,
      summary: `Moved ${section.title} section to the ${mutation.position}.`,
    };
  }

  for (const section of schema.sections) {
    const componentIndex = section.components.findIndex((component) =>
      matches(component.title, mutation.targetName),
    );
    if (componentIndex >= 0) {
      const [component] = section.components.splice(componentIndex, 1);
      if (mutation.position === "top") {
        section.components.unshift(component);
      } else {
        section.components.push(component);
      }
      sortComponents(section);
      return {
        changed: true,
        summary: `Moved ${component.title} to the ${mutation.position} of ${section.title}.`,
      };
    }
  }

  return {
    changed: false,
    summary: `No section or component matched ${mutation.targetName}.`,
  };
}

function updateComponentProp(
  schema: RuntimeSchema,
  mutation: Extract<RuntimeMutation, { type: "update_component_prop" }>,
) {
  if (mutation.prop === "append_component" && mutation.component) {
    const analyticsSection =
      schema.sections.find((section) => /analytics|overview/i.test(section.title)) ?? schema.sections[0];
    analyticsSection.components.push({
      ...mutation.component,
      order: analyticsSection.components.length + 1,
    });
    return {
      changed: true,
      summary: `Added ${mutation.component.title} to ${analyticsSection.title}.`,
    };
  }

  for (const section of schema.sections) {
    const component = section.components.find((item) =>
      mutation.targetName ? matches(item.title, mutation.targetName) : false,
    );

    if (!component) {
      continue;
    }

    if (mutation.prop === "content" && component.type === "card") {
      component.content = mutation.value;
    } else if (mutation.prop === "title") {
      component.title = mutation.value;
    } else if (mutation.prop === "description") {
      component.description = mutation.value;
    }

    return {
      changed: true,
      summary: `Updated ${component.title} ${mutation.prop}.`,
    };
  }

  return {
    changed: false,
    summary: `No component matched ${mutation.targetName ?? "the requested target"}.`,
  };
}

export function applyRuntimeMutation(
  currentSchema: RuntimeSchema,
  mutation: RuntimeMutation,
): { schema: RuntimeSchema; result: MutationApplyResult } {
  const schema = safeJsonClone(currentSchema);
  const operation =
    mutation.type === "add_field"
      ? addField(schema, mutation)
      : mutation.type === "remove_section"
        ? removeSection(schema, mutation)
      : mutation.type === "remove_component"
        ? removeComponent(schema, mutation)
      : mutation.type === "remove_field"
        ? removeField(schema, mutation)
        : mutation.type === "rename_field"
          ? renameField(schema, mutation)
          : mutation.type === "reorder_components"
            ? reorderComponents(schema, mutation)
            : updateComponentProp(schema, mutation);

  schema.version = currentSchema.version + (operation.changed ? 1 : 0);
  schema.metadata = {
    ...schema.metadata,
    lastEditedAt: new Date().toISOString(),
  };

  const parsed = runtimeSchemaValidator.safeParse(schema);
  if (!parsed.success) {
    throw new Error("Schema validation failed after mutation.");
  }

  return {
    schema: parsed.data,
    result: {
      schemaChanged: operation.changed,
      schemaSummary: operation.summary,
      mutation,
    },
  };
}

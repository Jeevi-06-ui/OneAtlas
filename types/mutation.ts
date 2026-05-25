import type {
  RuntimeComponent,
  RuntimeFormField,
  RuntimeTableColumn,
} from "@/types/runtime";

export type MutationType =
  | "add_field"
  | "remove_field"
  | "remove_section"
  | "remove_component"
  | "rename_field"
  | "reorder_components"
  | "update_component_prop"
  | "undo"
  | "manual_save";

export interface AddFieldMutation {
  type: "add_field";
  targetKind: "table" | "form" | "both";
  field: RuntimeFormField;
  column: RuntimeTableColumn;
}

export interface RemoveFieldMutation {
  type: "remove_field";
  fieldName: string;
}

export interface RemoveSectionMutation {
  type: "remove_section";
  targetName: string;
}

export interface RemoveComponentMutation {
  type: "remove_component";
  targetName: string;
}

export interface RenameFieldMutation {
  type: "rename_field";
  from: string;
  to: string;
}

export interface ReorderComponentsMutation {
  type: "reorder_components";
  targetName: string;
  position: "top" | "bottom";
}

export interface UpdateComponentPropMutation {
  type: "update_component_prop";
  targetName?: string;
  prop: "title" | "description" | "content" | "append_component";
  value: string;
  component?: RuntimeComponent;
}

export type RuntimeMutation =
  | AddFieldMutation
  | RemoveFieldMutation
  | RemoveSectionMutation
  | RemoveComponentMutation
  | RenameFieldMutation
  | ReorderComponentsMutation
  | UpdateComponentPropMutation;

export interface MutationParseResult {
  mutation: RuntimeMutation;
  matchedPhrase: string;
}

export interface MutationApplyResult {
  schemaChanged: boolean;
  schemaSummary: string;
  mutation: RuntimeMutation;
}

export interface MutationHistoryItem {
  id: string;
  version: number;
  instruction: string;
  mutationType: MutationType;
  resultSummary: string;
  createdAt: string;
}

export type RuntimeTone =
  | "neutral"
  | "sky"
  | "emerald"
  | "amber"
  | "rose"
  | "violet";

export type RuntimeDensity = "compact" | "comfortable" | "spacious";

export type RuntimePrimitive = string | number | boolean | null;

export type RuntimeRecord = Record<string, RuntimePrimitive>;

export type RuntimeComponentType =
  | "metric"
  | "chart"
  | "table"
  | "form"
  | "card"
  | "activity";

export type RuntimeWidth = "full" | "half" | "third";

export interface RuntimeNavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
}

export interface RuntimeSidebarGroup {
  id: string;
  label: string;
  items: RuntimeNavigationItem[];
}

export interface RuntimeSidebar {
  brand: string;
  groups: RuntimeSidebarGroup[];
}

export interface RuntimeTheme {
  mode: "light" | "dark" | "system";
  accent: RuntimeTone;
  density: RuntimeDensity;
  radius: "sm" | "md" | "lg";
}

export interface RuntimeBaseComponent {
  id: string;
  type: RuntimeComponentType;
  title: string;
  description?: string;
  order: number;
  width?: RuntimeWidth;
  locked?: boolean;
}

export interface RuntimeMetricComponent extends RuntimeBaseComponent {
  type: "metric";
  value: string;
  trend: string;
  tone: RuntimeTone;
  icon: string;
}

export interface RuntimeChartDatum {
  label: string;
  value: number;
  comparison?: number;
}

export interface RuntimeChartComponent extends RuntimeBaseComponent {
  type: "chart";
  chartType: "bar" | "line" | "area" | "donut";
  data: RuntimeChartDatum[];
  tone: RuntimeTone;
}

export type RuntimeTableColumnType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "status"
  | "email";

export interface RuntimeTableColumn {
  key: string;
  label: string;
  type: RuntimeTableColumnType;
  sortable?: boolean;
}

export interface RuntimeTableComponent extends RuntimeBaseComponent {
  type: "table";
  columns: RuntimeTableColumn[];
  rows: RuntimeRecord[];
  primaryAction?: string;
}

export type RuntimeFormFieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "textarea"
  | "date";

export interface RuntimeFormField {
  id: string;
  name: string;
  label: string;
  fieldType: RuntimeFormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface RuntimeFormComponent extends RuntimeBaseComponent {
  type: "form";
  fields: RuntimeFormField[];
  submitLabel: string;
}

export interface RuntimeCardAction {
  id: string;
  label: string;
  intent: "primary" | "secondary";
}

export interface RuntimeCardComponent extends RuntimeBaseComponent {
  type: "card";
  content: string;
  tone: RuntimeTone;
  actions?: RuntimeCardAction[];
}

export interface RuntimeActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  tone?: RuntimeTone;
}

export interface RuntimeActivityComponent extends RuntimeBaseComponent {
  type: "activity";
  items: RuntimeActivityItem[];
}

export type RuntimeComponent =
  | RuntimeMetricComponent
  | RuntimeChartComponent
  | RuntimeTableComponent
  | RuntimeFormComponent
  | RuntimeCardComponent
  | RuntimeActivityComponent;

export type RuntimeSectionLayout = "grid" | "stack" | "split";

export interface RuntimeSection {
  id: string;
  title: string;
  description?: string;
  layout: RuntimeSectionLayout;
  columns?: 1 | 2 | 3 | 4;
  components: RuntimeComponent[];
}

export interface RuntimeSchemaMetadata {
  generatedFrom: string;
  ownerRole: string;
  status: "draft" | "active" | "preview";
  lastEditedAt: string;
}

export interface RuntimeSchema {
  id: string;
  appName: string;
  templateSlug: string;
  version: number;
  theme: RuntimeTheme;
  sidebar: RuntimeSidebar;
  navigation: RuntimeNavigationItem[];
  sections: RuntimeSection[];
  metadata: RuntimeSchemaMetadata;
}

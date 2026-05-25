export interface RuntimeRenderActions {
  onTableAction?: (actionLabel: string, componentId: string, tableTitle: string) => void;
  onCardAction?: (actionLabel: string, componentId: string, cardTitle: string) => void;
  onFormSubmit?: (componentId: string, values: Record<string, string>) => void;
  onActivityItem?: (title: string, detail: string) => void;
  onNavSelect?: (href?: string) => void;
}

export interface RuntimeRenderContext {
  selectedId?: string | null;
  onSelect?: (componentId: string) => void;
  actions?: RuntimeRenderActions;
  interactive?: boolean;
}

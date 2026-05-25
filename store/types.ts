import type { RuntimeComponent, RuntimeSchema } from "@/types/runtime";

export interface BuilderSlice {
  appId: string | null;
  appName: string;
  version: number;
  initializeBuilder: (input: { appId: string; schema: RuntimeSchema; version: number }) => void;
  setAppName: (name: string) => void;
}

export interface SelectedComponentSlice {
  selectedComponentId: string | null;
  selectComponent: (componentId: string | null) => void;
}

export interface SchemaSlice {
  schema: RuntimeSchema | null;
  setSchema: (schema: RuntimeSchema, version?: number) => void;
  updateComponent: (
    componentId: string,
    updater: (component: RuntimeComponent) => RuntimeComponent,
  ) => void;
}

export interface HistorySlice {
  localHistory: RuntimeSchema[];
  pushLocalHistory: (schema: RuntimeSchema) => void;
  undoLocalHistory: () => RuntimeSchema | null;
  clearLocalHistory: () => void;
}

export interface PreviewSlice {
  previewUrl: string | null;
  isCreatingPreview: boolean;
  setPreviewUrl: (url: string | null) => void;
  setIsCreatingPreview: (isCreating: boolean) => void;
}

export interface UiSlice {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  isEditing: boolean;
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export type BuilderStore = BuilderSlice &
  SelectedComponentSlice &
  SchemaSlice &
  HistorySlice &
  PreviewSlice &
  UiSlice;

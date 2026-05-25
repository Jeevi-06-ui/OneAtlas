import type { MutationHistoryItem } from "@/types/mutation";
import type { RuntimeSchema } from "@/types/runtime";
import type { TemplateConfig } from "@/types/template";

export interface ApiErrorPayload {
  code: string;
  message: string;
  suggestion?: string;
  details?: Record<string, string[]>;
}

export interface ApiFailure {
  error: ApiErrorPayload;
}

export interface GenerateAppInput {
  prompt: string;
  templateSlug?: string;
}

export interface GenerateAppResponse {
  appId: string;
  generatedName: string;
  templateUsed: Pick<TemplateConfig, "id" | "name" | "slug" | "category">;
  schema: RuntimeSchema;
  confidence: number;
}

export interface EditAppInput {
  instruction: string;
}

export interface EditAppResponse {
  schema: RuntimeSchema;
  newVersion: number;
  mutationSummary: string;
}

export interface PreviewSnapshotResponse {
  previewUrl: string;
  token: string;
  expiresAt: string;
}

export interface FrozenPreviewResponse {
  token: string;
  schema: RuntimeSchema;
  createdAt: string;
  expiresAt: string;
}

export interface AppHistoryResponse {
  history: MutationHistoryItem[];
}

"use client";

import { SendHorizontal, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyRuntimeMutation } from "@/services/mutation-engine";
import { parseMutationInstruction } from "@/services/mutation-parser";
import { useBuilderStore } from "@/store/builder-store";
import type { ApiFailure, EditAppResponse } from "@/types/api";

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function ConversationStrip() {
  const [instruction, setInstruction] = useState("");
  const appId = useBuilderStore((state) => state.appId);
  const schema = useBuilderStore((state) => state.schema);
  const setSchema = useBuilderStore((state) => state.setSchema);
  const pushLocalHistory = useBuilderStore((state) => state.pushLocalHistory);
  const setIsEditing = useBuilderStore((state) => state.setIsEditing);
  const isEditing = useBuilderStore((state) => state.isEditing);

  async function applyLocalMutation() {
    if (!schema) {
      return;
    }

    const parsed = parseMutationInstruction(instruction, schema);
    const applied = applyRuntimeMutation(schema, parsed.mutation);
    pushLocalHistory(applied.schema);
    setSchema(applied.schema, applied.schema.version);
    toast.success(applied.result.schemaSummary);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = instruction.trim();
    if (!trimmed || !schema || !appId) {
      return;
    }

    setIsEditing(true);
    try {
      if (appId.startsWith("demo-")) {
        await applyLocalMutation();
        setInstruction("");
        return;
      }

      const response = await fetch(`/api/apps/${appId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: trimmed }),
      });
      const payload = (await response.json()) as EditAppResponse | ApiFailure;

      if (!response.ok || isApiFailure(payload)) {
        throw new Error(isApiFailure(payload) ? payload.error.message : "Mutation failed.");
      }

      pushLocalHistory(payload.schema);
      setSchema(payload.schema, payload.newVersion);
      toast.success(payload.mutationSummary);
      setInstruction("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not apply mutation.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border bg-card p-3">
      <div className="hidden size-9 place-items-center rounded-md bg-muted text-muted-foreground sm:grid">
        <Sparkles className="size-4" aria-hidden="true" />
      </div>
      <Input
        value={instruction}
        onChange={(event) => setInstruction(event.target.value)}
        placeholder="Ask OneAtlas to add a revenue chart, rename contact to client, remove notes column, or move analytics section to top"
        aria-label="Conversational schema instruction"
      />
      <Button type="submit" disabled={isEditing || instruction.trim().length === 0}>
        <SendHorizontal aria-hidden="true" />
        <span className="hidden sm:inline">{isEditing ? "Applying" : "Send"}</span>
      </Button>
    </form>
  );
}

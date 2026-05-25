"use client";

import { History } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useBuilderStore } from "@/store/builder-store";
import type { ApiFailure, AppHistoryResponse } from "@/types/api";
import type { MutationHistoryItem } from "@/types/mutation";

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function EditHistoryPanel() {
  const appId = useBuilderStore((state) => state.appId);
  const version = useBuilderStore((state) => state.version);
  const [history, setHistory] = useState<MutationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!appId || appId.startsWith("demo-")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/apps/${appId}/history`);
      const payload = (await response.json()) as AppHistoryResponse | ApiFailure;
      if (!response.ok || isApiFailure(payload)) {
        return;
      }
      setHistory(payload.history);
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory, version]);

  if (!appId || appId.startsWith("demo-")) {
    return null;
  }

  return (
    <div className="border-t border-border bg-muted/30 px-3 py-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Edit history</p>
        </div>
        <Badge variant="outline" className="text-[10px]">
          {isLoading ? "Loading" : `${history.length} edits`}
        </Badge>
      </div>
      <div className="scrollbar-thin max-h-28 space-y-2 overflow-auto">
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground">No persisted mutations yet.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="rounded-md border border-border bg-card px-2 py-1.5 text-xs">
              <p className="font-medium text-foreground">{entry.instruction}</p>
              <p className="mt-0.5 text-muted-foreground">
                {entry.mutationType} · {new Date(entry.createdAt).toLocaleString()}
              </p>
              <p className="mt-0.5 text-muted-foreground">{entry.resultSummary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { getRuntimeIcon } from "@/components/runtime-renderer/icon-map";
import { getRuntimeAccentClasses } from "@/lib/runtime-theme";
import { cn } from "@/lib/utils";
import type { RuntimeSchema } from "@/types/runtime";

interface RuntimeSidebarProps {
  schema: RuntimeSchema;
  activeNavId?: string | null;
  onNavSelect?: (itemId: string) => void;
  className?: string;
}

export function RuntimeSidebar({ schema, activeNavId, onNavSelect, className }: RuntimeSidebarProps) {
  const accent = getRuntimeAccentClasses(schema.theme.accent);
  const firstItemId = schema.sidebar.groups[0]?.items[0]?.id ?? null;
  const activeId = activeNavId ?? firstItemId;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/95",
        accent.border,
        className,
      )}
      data-runtime-accent={schema.theme.accent}
    >
      <div className={cn("border-b border-border px-4 py-4", accent.border)}>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {schema.metadata.ownerRole}
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug">{schema.sidebar.brand}</p>
        <p className="mt-1 text-xs text-muted-foreground">Schema v{schema.version}</p>
      </div>
      <nav className="scrollbar-thin flex-1 overflow-auto p-3" aria-label="Runtime app navigation">
        {schema.sidebar.groups.map((group) => (
          <div key={group.id} className="mb-4">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
            <div className="grid gap-1">
              {group.items.map((item) => {
                const Icon = getRuntimeIcon(item.icon);
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavSelect?.(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted/60 hover:text-foreground",
                      isActive && accent.sidebarActive,
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

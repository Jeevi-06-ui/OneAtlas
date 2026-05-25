"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface RendererFrameProps {
  id: string;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
  children: ReactNode;
  className?: string;
}

export function RendererFrame({ id, selected, onSelect, children, className }: RendererFrameProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(id);
    }
  }

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(id)}
      onKeyDown={handleKeyDown}
      className={cn(
        "rounded-lg outline-none transition",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
        onSelect && "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}

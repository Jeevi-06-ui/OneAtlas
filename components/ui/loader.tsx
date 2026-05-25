import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Loader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

"use client";

import { Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface PreviewBannerProps {
  previewUrl?: string;
  expiresAt?: string;
}

export function PreviewBanner({ previewUrl, expiresAt }: PreviewBannerProps) {
  const { copy } = useCopyToClipboard();

  async function copyLink() {
    await copy(previewUrl ?? window.location.href);
    toast.success("Preview link copied");
  }

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            <ShieldCheck className="mr-1 size-3" aria-hidden="true" />
            Frozen preview
          </Badge>
          {expiresAt ? <span className="text-xs text-muted-foreground">Expires {new Date(expiresAt).toLocaleString()}</span> : null}
        </div>
        <Button type="button" size="sm" variant="outline" onClick={copyLink}>
          <Copy aria-hidden="true" />
          Copy link
        </Button>
      </div>
    </div>
  );
}

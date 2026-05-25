"use client";

import { useState } from "react";

export function useCopyToClipboard(timeoutMs = 1400) {
  const [copied, setCopied] = useState(false);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), timeoutMs);
  }

  return { copied, copy };
}

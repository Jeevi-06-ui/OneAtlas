"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ErrorBoundary() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={AlertTriangle}
          title="Something slipped in the runtime"
          description="Reload the page or return to the builder entry point."
        />
        <Button asChild className="mt-4 w-full">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}

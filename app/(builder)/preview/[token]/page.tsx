import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { PreviewBanner } from "@/components/builder/preview-banner";
import { RuntimeAppShell } from "@/components/runtime-renderer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getPreviewSnapshot } from "@/services/preview-service";

export const dynamic = "force-dynamic";

interface PreviewPageProps {
  params: Promise<{ token: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { token } = await params;
  const snapshot = await getPreviewSnapshot(token).catch(() => ({ status: "invalid" as const }));

  if (snapshot.status === "invalid") {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={AlertTriangle}
            title="Preview link not found"
            description="This token does not map to an active OneAtlas preview snapshot."
          />
          <Button asChild className="mt-4 w-full">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (snapshot.status === "expired") {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6">
        <div className="w-full max-w-lg">
          <EmptyState
            icon={AlertTriangle}
            title="Preview link expired"
            description="Create a fresh frozen preview from the live builder."
          />
          <Button asChild className="mt-4 w-full">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </main>
    );
  }

  const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/preview/${snapshot.token}`;

  return (
    <main className="min-h-screen bg-background">
      <PreviewBanner previewUrl={previewUrl} expiresAt={snapshot.expiresAt?.toISOString()} />
      <div className="runtime-grid p-4 sm:p-8">
        <div className="mx-auto mb-6 max-w-7xl rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-medium">{snapshot.schema.appName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Immutable schema snapshot created {snapshot.createdAt.toLocaleString()}
          </p>
        </div>
        <RuntimeAppShell schema={snapshot.schema} previewMode />
      </div>
    </main>
  );
}

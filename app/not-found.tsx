import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={SearchX}
          title="Runtime not found"
          description="The app or page you requested does not exist in this OneAtlas workspace."
        />
        <Button asChild className="mt-4 w-full">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}

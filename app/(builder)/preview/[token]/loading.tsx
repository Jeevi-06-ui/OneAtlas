import { Skeleton } from "@/components/ui/skeleton";

export default function PreviewLoading() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Skeleton className="h-14 w-full" />
      <div className="mx-auto mt-8 grid max-w-7xl gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

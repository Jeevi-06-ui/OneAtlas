import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 p-6">
      <Skeleton className="h-16" />
      <Skeleton className="h-96" />
      <Skeleton className="h-64" />
    </div>
  );
}

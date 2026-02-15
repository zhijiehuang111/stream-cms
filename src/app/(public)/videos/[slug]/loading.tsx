import { Skeleton } from "@/components/ui/skeleton";

export default function VideoDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="aspect-video w-full max-w-4xl rounded-xl" />
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

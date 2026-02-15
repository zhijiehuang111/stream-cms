"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold">發生錯誤</h2>
      <p className="text-muted-foreground mt-2">{error.message || "請稍後再試"}</p>
      <Button onClick={reset} className="mt-6">
        重試
      </Button>
    </div>
  );
}

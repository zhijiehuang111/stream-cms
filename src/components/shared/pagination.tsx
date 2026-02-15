import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  baseHref,
}: {
  page: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;

  const separator = baseHref.includes("?") ? "&" : "?";

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button variant="outline" size="icon" asChild disabled={page <= 1}>
        <Link href={`${baseHref}${separator}page=${page - 1}`}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={page >= totalPages}
      >
        <Link href={`${baseHref}${separator}page=${page + 1}`}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

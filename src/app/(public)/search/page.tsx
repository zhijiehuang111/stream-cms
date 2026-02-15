import type { Metadata } from "next";
import { searchVideos } from "@/data/videos";
import { VideoGrid } from "@/components/public/video-grid";
import { SearchBar } from "@/components/public/search-bar";
import { Pagination } from "@/components/shared/pagination";
import { Suspense } from "react";

export const metadata: Metadata = { title: "搜尋" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Number(params.page) || 1;

  const result = q ? await searchVideos(q, { page }) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">搜尋影片</h1>
      <Suspense>
        <SearchBar />
      </Suspense>
      <div className="mt-8">
        {result ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              找到 {result.total} 筆「{q}」的結果
            </p>
            <VideoGrid videos={result.items} />
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              baseHref={`/search?q=${encodeURIComponent(q)}`}
            />
          </>
        ) : (
          q === "" && (
            <p className="text-muted-foreground">請輸入搜尋關鍵字</p>
          )
        )}
      </div>
    </div>
  );
}

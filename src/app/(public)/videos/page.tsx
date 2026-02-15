import type { Metadata } from "next";
import { getPublishedVideos } from "@/data/videos";
import { VideoGrid } from "@/components/public/video-grid";
import { Pagination } from "@/components/shared/pagination";

export const metadata: Metadata = { title: "影片列表" };

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getPublishedVideos({ page });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">影片列表</h1>
      <VideoGrid videos={result.items} />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseHref="/videos"
      />
    </div>
  );
}

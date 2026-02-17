import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/data/videos";
import { VideoPlayer } from "@/components/public/video-player";
import { formatDate, formatDuration } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "影片不存在" };

  return {
    title: video.title,
    description: video.description?.slice(0, 160) ?? undefined,
    openGraph: {
      title: video.title,
      description: video.description?.slice(0, 160) ?? undefined,
      images: video.thumbnailUrl
        ? [video.thumbnailUrl]
        : video.muxPlaybackId
          ? [`https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`]
          : undefined,
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video || video.status !== "published" || !video.muxPlaybackId) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl || (video.muxPlaybackId ? `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg` : undefined),
    uploadDate: video.createdAt,
    duration: video.duration ? `PT${video.duration}S` : undefined,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <VideoPlayer playbackId={video.muxPlaybackId} title={video.title} />

        <div className="mt-6">
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {video.duration > 0 && <span>{formatDuration(video.duration)}</span>}
            <span>{formatDate(video.createdAt)}</span>
          </div>
          {video.description && (
            <p className="mt-4 whitespace-pre-line text-muted-foreground">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

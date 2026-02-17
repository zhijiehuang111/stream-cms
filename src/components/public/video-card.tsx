import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import type { VideoCardData } from "@/types";

export function VideoCard({ video }: { video: VideoCardData }) {
  const thumbnail =
    video.thumbnailUrl ||
    (video.muxPlaybackId
      ? `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`
      : null);

  return (
    <Link href={`/videos/${video.slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-video bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No thumbnail
            </div>
          )}
          {video.duration > 0 && (
            <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs text-white">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {video.title}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}

import { VideoCard } from "./video-card";
import type { VideoCardData } from "@/types";

export function VideoGrid({ videos }: { videos: VideoCardData[] }) {
  if (videos.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        目前沒有影片
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

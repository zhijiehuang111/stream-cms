"use client";

import MuxPlayer from "@mux/mux-player-react";

export function VideoPlayer({
  playbackId,
  title,
}: {
  playbackId: string;
  title: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        accentColor="#0ea5e9"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

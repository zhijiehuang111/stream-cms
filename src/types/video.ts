import type { VideoModel as Video } from "@/generated/prisma/models/Video";

export type VideoStatus = "draft" | "published" | "archived";
export type UploadStatus = "waiting" | "processing" | "ready" | "errored";

/** Subset for public video cards (listing pages) */
export type VideoCardData = Pick<
  Video,
  | "id"
  | "title"
  | "slug"
  | "thumbnailUrl"
  | "muxPlaybackId"
  | "duration"
  | "status"
  | "createdAt"
>;

/** Full data for public video detail page */
export type VideoDetailData = Video;

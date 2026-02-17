import "server-only";

import { prisma } from "@/lib/db";
import type { VideoCardData } from "@/types";

export type DashboardStats = {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
};

const videoCardSelect = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  duration: true,
  status: true,
  createdAt: true,
} as const;

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalVideos, publishedVideos, draftVideos] =
    await Promise.all([
      prisma.video.count(),
      prisma.video.count({ where: { status: "published" } }),
      prisma.video.count({ where: { status: "draft" } }),
    ]);

  return {
    totalVideos,
    publishedVideos,
    draftVideos,
  };
}

export async function getRecentVideos(limit = 5): Promise<VideoCardData[]> {
  const videos = await prisma.video.findMany({
    select: videoCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return videos as VideoCardData[];
}

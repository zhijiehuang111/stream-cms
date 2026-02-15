import "server-only";

import { prisma } from "@/lib/db";
import type { VideoCardData } from "@/types";

export type DashboardStats = {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalViews: number;
};

const videoCardSelect = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  duration: true,
  status: true,
  viewCount: true,
  createdAt: true,
} as const;

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalVideos, publishedVideos, draftVideos, viewsAgg] =
    await Promise.all([
      prisma.video.count(),
      prisma.video.count({ where: { status: "published" } }),
      prisma.video.count({ where: { status: "draft" } }),
      prisma.video.aggregate({ _sum: { viewCount: true } }),
    ]);

  return {
    totalVideos,
    publishedVideos,
    draftVideos,
    totalViews: viewsAgg._sum.viewCount ?? 0,
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

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const videos = await prisma.video.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/videos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...videos.map((v) => ({
      url: `${BASE_URL}/videos/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

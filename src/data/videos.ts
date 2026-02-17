import "server-only";

import { prisma } from "@/lib/db";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type {
  VideoCardData,
  VideoDetailData,
  PaginatedResponse,
} from "@/types";
import type { VideoModel as Video } from "@/generated/prisma/models/Video";

// ── Shared select objects ──────────────────────────────────

const videoCardSelect = {
  id: true,
  title: true,
  slug: true,
  thumbnailUrl: true,
  muxPlaybackId: true,
  duration: true,
  status: true,
  createdAt: true,
} as const;

// ── Admin: paginated video list (all statuses) ─────────────

export async function getVideos(opts: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedResponse<Video>> {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (opts.status) where.status = opts.status;
  if (opts.search) {
    where.OR = [
      { title: { contains: opts.search } },
      { description: { contains: opts.search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ── Public: published videos with pagination ───────────────

export async function getPublishedVideos(opts?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<VideoCardData>> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where = {
    status: "published" as const,
    uploadStatus: "ready" as const,
  };

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      where,
      select: videoCardSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    items: items as VideoCardData[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ── Public: single video by slug ───────────────────────────

export async function getVideoBySlug(
  slug: string,
): Promise<VideoDetailData | null> {
  const video = await prisma.video.findUnique({
    where: { slug },
  });
  return video as VideoDetailData | null;
}

// ── Public: search published videos ────────────────────────

export async function searchVideos(
  query: string,
  opts?: { page?: number; pageSize?: number },
): Promise<PaginatedResponse<VideoCardData>> {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const where = {
    status: "published" as const,
    uploadStatus: "ready" as const,
    OR: [
      { title: { contains: query } },
      { description: { contains: query } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      where,
      select: videoCardSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    items: items as VideoCardData[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ── Admin: get single video by ID (for edit form) ──────────

export async function getVideoById(
  id: string,
): Promise<Video | null> {
  return prisma.video.findUnique({ where: { id } });
}


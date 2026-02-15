import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { ApiResponse, ApiErrorResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { success: false, error: "搜尋關鍵字為必填" } satisfies ApiErrorResponse,
      { status: 400 },
    );
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE),
  );
  const skip = (page - 1) * pageSize;

  const where = {
    status: "published" as const,
    OR: [
      { title: { contains: query } },
      { description: { contains: query } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.video.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        duration: true,
        viewCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.video.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  } satisfies ApiResponse<unknown>);
}

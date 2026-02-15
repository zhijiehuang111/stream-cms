import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createVideoSchema } from "@/lib/validations/video";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { ApiResponse, ApiErrorResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE),
  );
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
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

  return NextResponse.json({
    success: true,
    data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  } satisfies ApiResponse<unknown>);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createVideoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }

    const data = parsed.data;
    const video = await prisma.video.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        muxUploadId: data.muxUploadId,
        thumbnailUrl: data.thumbnailUrl || null,
        status: data.status,
        uploadStatus: "processing",
      },
    });

    return NextResponse.json(
      { success: true, data: video } satisfies ApiResponse<unknown>,
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "建立影片失敗" } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

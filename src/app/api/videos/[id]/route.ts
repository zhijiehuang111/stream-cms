import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateVideoSchema } from "@/lib/validations/video";
import type { ApiResponse, ApiErrorResponse } from "@/types/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const video = await prisma.video.findUnique({ where: { id } });

  if (!video) {
    return NextResponse.json(
      { success: false, error: "影片不存在" } satisfies ApiErrorResponse,
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: video } satisfies ApiResponse<unknown>);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const parsed = updateVideoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message } satisfies ApiErrorResponse,
        { status: 400 },
      );
    }

    const data = parsed.data;
    const video = await prisma.video.update({
      where: { id },
      data: {
        ...data,
        thumbnailUrl: data.thumbnailUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: video } satisfies ApiResponse<unknown>);
  } catch {
    return NextResponse.json(
      { success: false, error: "更新影片失敗" } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  try {
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null } satisfies ApiResponse<unknown>);
  } catch {
    return NextResponse.json(
      { success: false, error: "刪除影片失敗" } satisfies ApiErrorResponse,
      { status: 500 },
    );
  }
}

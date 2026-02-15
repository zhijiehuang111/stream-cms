"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { syncUploadStatus } from "@/lib/mux";
import { createVideoSchema, updateVideoSchema } from "@/lib/validations/video";
import type { ActionResult } from "@/types";

export async function createVideo(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const raw = Object.fromEntries(formData);
  const parsed = createVideoSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
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

  // Mux webhooks may have already fired before the record was created.
  // Sync current status from Mux API to catch up.
  try {
    const muxStatus = await syncUploadStatus(data.muxUploadId);
    if (muxStatus.uploadStatus !== "processing") {
      await prisma.video.update({
        where: { id: video.id },
        data: muxStatus,
      });
    }
  } catch {
    // Non-critical — webhook will eventually update
  }

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
  return { success: true, data: { id: video.id } };
}

export async function updateVideo(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = updateVideoSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { muxUploadId: _ignored, ...data } = parsed.data;
  await prisma.video.update({
    where: { id },
    data: {
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
  return { success: true, data: undefined };
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
  return { success: true, data: undefined };
}

export async function toggleVideoPublish(id: string): Promise<ActionResult> {
  const video = await prisma.video.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!video) return { success: false, error: "影片不存在" };

  const newStatus = video.status === "published" ? "draft" : "published";
  await prisma.video.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/admin/videos");
  revalidatePath("/");
  revalidatePath("/videos");
  return { success: true, data: undefined };
}

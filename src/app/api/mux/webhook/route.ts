import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import mux from "@/lib/mux";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("mux-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Verify webhook signature
  try {
    mux.webhooks.verifySignature(
      body,
      { "mux-signature": signature },
      process.env.MUX_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const { type, data } = event;

  switch (type) {
    case "video.upload.asset_created": {
      const uploadId = data.id as string;
      const assetId = data.asset_id as string;

      await prisma.video.updateMany({
        where: { muxUploadId: uploadId },
        data: { muxAssetId: assetId, uploadStatus: "processing" },
      });
      break;
    }

    case "video.asset.ready": {
      const assetId = data.id as string;
      const uploadId = data.upload_id as string | undefined;
      const playbackId = data.playback_ids?.[0]?.id as string | undefined;
      const duration = Math.round((data.duration as number) ?? 0);

      const updateData = {
        muxAssetId: assetId,
        muxPlaybackId: playbackId ?? null,
        duration,
        uploadStatus: "ready",
      };

      // Try matching by assetId first, fallback to uploadId
      const result = await prisma.video.updateMany({
        where: { muxAssetId: assetId },
        data: updateData,
      });

      if (result.count === 0 && uploadId) {
        await prisma.video.updateMany({
          where: { muxUploadId: uploadId },
          data: updateData,
        });
      }
      break;
    }

    case "video.asset.errored": {
      const assetId = data.id as string;
      const uploadId = data.upload_id as string | undefined;

      const result = await prisma.video.updateMany({
        where: { muxAssetId: assetId },
        data: { uploadStatus: "errored" },
      });

      if (result.count === 0 && uploadId) {
        await prisma.video.updateMany({
          where: { muxUploadId: uploadId },
          data: { muxAssetId: assetId, uploadStatus: "errored" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

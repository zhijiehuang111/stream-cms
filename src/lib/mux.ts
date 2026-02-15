import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function createUploadUrl() {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
    },
    cors_origin: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  });

  return { uploadUrl: upload.url, uploadId: upload.id };
}

/** Check upload status and return asset info if ready */
export async function syncUploadStatus(uploadId: string) {
  const upload = await mux.video.uploads.retrieve(uploadId);

  if (!upload.asset_id) {
    return { uploadStatus: "processing" as const };
  }

  const asset = await mux.video.assets.retrieve(upload.asset_id);

  if (asset.status === "ready") {
    return {
      uploadStatus: "ready" as const,
      muxAssetId: asset.id,
      muxPlaybackId: asset.playback_ids?.[0]?.id ?? null,
      duration: Math.round(asset.duration ?? 0),
    };
  }

  if (asset.status === "errored") {
    return { uploadStatus: "errored" as const, muxAssetId: asset.id };
  }

  return { uploadStatus: "processing" as const, muxAssetId: asset.id };
}

export default mux;

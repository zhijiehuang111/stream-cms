"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import MuxUploader from "@mux/mux-uploader-react";
import { Film, ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VIDEO_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { createVideo, updateVideo } from "@/actions/video-actions";

type VideoData = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  muxPlaybackId: string | null;
  muxUploadId: string | null;
  thumbnailUrl: string | null;
  duration: number;
  status: string;
  uploadStatus: string;
};

export function VideoForm({ video }: { video?: VideoData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!video;

  const [muxUploadId, setMuxUploadId] = useState(video?.muxUploadId ?? "");
  const [muxUploadUrl, setMuxUploadUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(!!video?.muxUploadId);
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl ?? "");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const result = isEdit
      ? await updateVideo(video.id, formData)
      : await createVideo(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/admin/videos");
    router.refresh();
  }

  function handleTitleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (isEdit) return;
    const slugInput = document.getElementById("slug") as HTMLInputElement;
    if (slugInput && !slugInput.value) {
      slugInput.value = slugify(e.target.value);
    }
  }

  async function handleStartUpload() {
    setVideoUploading(true);
    try {
      const res = await fetch("/api/mux/upload", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMuxUploadUrl(data.uploadUrl);
      setMuxUploadId(data.uploadId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得上傳網址失敗");
      setVideoUploading(false);
    }
  }

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/thumbnail", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setThumbnailUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "縮圖上傳失敗");
    } finally {
      setThumbnailUploading(false);
    }
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">標題 *</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={video?.title}
          onBlur={handleTitleBlur}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" name="slug" required defaultValue={video?.slug} />
      </div>

      {/* 影片上傳 */}
      <div className="space-y-2">
        <Label>影片 {!isEdit && "*"}</Label>
        <input type="hidden" name="muxUploadId" value={muxUploadId} />

        {!muxUploadUrl && !videoUploaded && (
          <Button
            type="button"
            variant="outline"
            onClick={handleStartUpload}
            disabled={videoUploading}
          >
            {videoUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Film className="mr-2 h-4 w-4" />
            )}
            {videoUploading ? "準備上傳..." : "上傳影片"}
          </Button>
        )}

        {muxUploadUrl && !videoUploaded && (
          <MuxUploader
            endpoint={muxUploadUrl}
            onSuccess={() => {
              setVideoUploaded(true);
              setVideoUploading(false);
            }}
            onError={() => {
              setError("影片上傳失敗，請重試");
              setVideoUploading(false);
            }}
          />
        )}

        {videoUploaded && (
          <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
            <Film className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {isEdit ? "影片已上傳（由 Mux 處理）" : "影片上傳完成，等待 Mux 轉碼"}
            </span>
            {!isEdit && (
              <button
                type="button"
                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMuxUploadId("");
                  setMuxUploadUrl("");
                  setVideoUploaded(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 縮圖上傳 */}
      <div className="space-y-2">
        <Label>縮圖</Label>
        <p className="text-xs text-muted-foreground">
          不上傳時將使用 Mux 自動產生的縮圖
        </p>
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />
        <Button
          type="button"
          variant="outline"
          disabled={thumbnailUploading}
          onClick={() => thumbnailInputRef.current?.click()}
        >
          {thumbnailUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="mr-2 h-4 w-4" />
          )}
          {thumbnailUploading
            ? "上傳中..."
            : thumbnailUrl
              ? "重新上傳縮圖"
              : "上傳自訂縮圖"}
        </Button>

        {thumbnailUrl && (
          <div className="relative mt-2 inline-block">
            <Image
              src={thumbnailUrl}
              alt="縮圖預覽"
              width={320}
              height={180}
              className="rounded-md border"
            />
            <button
              type="button"
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
              onClick={() => setThumbnailUrl("")}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>時長</Label>
          <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
            {video?.duration && video.duration > 0
              ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`
              : "由 Mux 自動偵測"}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">狀態</Label>
          <Select name="status" defaultValue={video?.status ?? "draft"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIDEO_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={video?.description ?? ""}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading || (!isEdit && !videoUploaded)}
        >
          {loading ? "儲存中..." : isEdit ? "更新影片" : "建立影片"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          取消
        </Button>
      </div>
    </form>
  );
}

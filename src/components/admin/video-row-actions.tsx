"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteVideo, toggleVideoPublish } from "@/actions/video-actions";

export function VideoRowActions({
  videoId,
  status,
}: {
  videoId: string;
  status: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("確定要刪除此影片？")) return;
    await deleteVideo(videoId);
    router.refresh();
  }

  async function handleToggle() {
    await toggleVideoPublish(videoId);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/videos/${videoId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            編輯
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggle}>
          {status === "published" ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              取消發布
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              發布
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

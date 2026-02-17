import Link from "next/link";
import { getVideos } from "@/data/videos";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VideoStatusBadge } from "@/components/admin/video-status-badge";
import { UploadStatusBadge } from "@/components/admin/upload-status-badge";
import { formatDate } from "@/lib/utils";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { Pagination } from "@/components/shared/pagination";
import { Plus } from "lucide-react";
import { VideoRowActions } from "@/components/admin/video-row-actions";

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const result = await getVideos({ page, pageSize: ADMIN_PAGE_SIZE });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">影片管理</h1>
        <Button asChild>
          <Link href="/admin/videos/new">
            <Plus className="mr-2 h-4 w-4" />
            新增影片
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>標題</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>上傳狀態</TableHead>
            <TableHead>建立日期</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.items.map((video) => (
            <TableRow key={video.id}>
              <TableCell className="font-medium">{video.title}</TableCell>
              <TableCell>
                <VideoStatusBadge status={video.status} />
              </TableCell>
              <TableCell>
                <UploadStatusBadge status={video.uploadStatus} />
              </TableCell>
              <TableCell>{formatDate(video.createdAt)}</TableCell>
              <TableCell>
                <VideoRowActions videoId={video.id} status={video.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseHref="/admin/videos"
      />
    </div>
  );
}

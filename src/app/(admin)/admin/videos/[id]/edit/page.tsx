import { notFound } from "next/navigation";
import { getVideoById } from "@/data/videos";
import { VideoForm } from "@/components/admin/video-form";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">編輯影片</h1>
      <VideoForm video={video} />
    </div>
  );
}

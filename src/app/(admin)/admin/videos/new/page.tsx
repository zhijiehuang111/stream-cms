import { VideoForm } from "@/components/admin/video-form";

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新增影片</h1>
      <VideoForm />
    </div>
  );
}

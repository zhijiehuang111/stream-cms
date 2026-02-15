import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  ready: { label: "就緒", variant: "default" },
  processing: { label: "轉碼中", variant: "secondary" },
  waiting: { label: "等待中", variant: "outline" },
  errored: { label: "錯誤", variant: "destructive" },
};

export function UploadStatusBadge({ status }: { status: string }) {
  const info = statusMap[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

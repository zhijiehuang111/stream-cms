import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  published: { label: "已發布", variant: "default" },
  draft: { label: "草稿", variant: "secondary" },
  archived: { label: "已封存", variant: "outline" },
};

export function VideoStatusBadge({ status }: { status: string }) {
  const info = statusMap[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

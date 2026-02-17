import { getDashboardStats, getRecentVideos } from "@/data/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([
    getDashboardStats(),
    getRecentVideos(),
  ]);

  const statCards = [
    { label: "影片總數", value: stats.totalVideos, icon: Film },
    { label: "已發布", value: stats.publishedVideos, icon: FileText },
    { label: "草稿", value: stats.draftVideos, icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近上架影片</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground">尚無影片</p>
          ) : (
            <ul className="divide-y">
              {recent.map((v) => (
                <li key={v.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{v.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(v.createdAt)}
                    </p>
                  </div>
                  <Badge variant={v.status === "published" ? "default" : "secondary"}>
                    {v.status === "published" ? "已發布" : v.status === "draft" ? "草稿" : "封存"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

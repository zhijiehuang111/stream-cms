import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">找不到您要的頁面</p>
      <Button asChild>
        <Link href="/">回到首頁</Link>
      </Button>
    </div>
  );
}

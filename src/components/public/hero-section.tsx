import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_DESCRIPTION } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="border-b bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {SITE_DESCRIPTION}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            探索精選影片內容，隨時隨地觀看學習
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/videos">瀏覽影片</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

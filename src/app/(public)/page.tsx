import { getPublishedVideos } from "@/data/videos";
import { HeroSection } from "@/components/public/hero-section";
import { VideoGrid } from "@/components/public/video-grid";

export default async function HomePage() {
  const result = await getPublishedVideos();

  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-6 text-2xl font-bold">所有影片</h2>
          <VideoGrid videos={result.items} />
        </section>
      </div>
    </>
  );
}

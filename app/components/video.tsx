import { Play, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = [
  {
    title: "iPhone 16 Pro Max Unboxing & First Impressions",
    thumbnail: "/video-iphone-unboxing-thumbnail.jpg",
    duration: "12:45",
    views: "2.4M",
    description:
      "Join us as we unbox the latest iPhone and explore its stunning design and features",
  },
  {
    title: "Top 5 Camera Phones in 2024",
    thumbnail: "/video-camera-phones-comparison.jpg",
    duration: "15:30",
    views: "1.8M",
    description:
      "Comprehensive comparison of the best smartphone cameras on the market",
  },
  {
    title: "How to Choose the Perfect Smartphone",
    thumbnail: "/video-smartphone-buying-guide.jpg",
    duration: "10:20",
    views: "3.1M",
    description:
      "Expert tips and advice for finding the right phone for your needs and budget",
  },
];

export function Videos() {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
            Watch & Learn
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Expert reviews, unboxings, and tutorials to help you make the best
            choice
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-110">
                      <Play className="ml-1 h-8 w-8 fill-primary-foreground text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
              </div>
              <h3 className="mb-2 text-balance text-xl font-semibold text-foreground group-hover:text-primary">
                {video.title}
              </h3>
              <p className="mb-3 text-pretty text-sm text-muted-foreground">
                {video.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{video.views} views</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg">
            <Play className="mr-2 h-5 w-5" />
            View All Videos
          </Button>
        </div>
      </div>
    </section>
  );
}

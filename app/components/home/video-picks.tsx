import Image from "next/image";

import { VIDEO_PICKS } from "./home-data";
import { ArrowLink } from "./arrow-link";

/** 3 video đáng xem nhất; trượt ngang trên mobile. */
export function VideoPicks() {
  return (
    <section aria-labelledby="video-title" className="bg-surface py-section">
      <div className="container-page">
        <div className="mb-block flex items-end justify-between gap-4">
          <h2 id="video-title" className="text-h2 text-foreground">Xem trước khi mua</h2>
          <ArrowLink href="/guides">Tất cả cẩm nang</ArrowLink>
        </div>
        <div className="-mx-gutter grid snap-x snap-mandatory auto-cols-[min(80%,22rem)] grid-flow-col gap-5 overflow-x-auto px-gutter pb-2 lg:mx-0 lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {VIDEO_PICKS.map((video) => (
            <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group flex snap-start flex-col gap-3">
              <span className="relative block aspect-[854/458] overflow-hidden rounded-xl">
                <Image src={video.image} alt="" fill sizes="(max-width: 1023px) 80vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </span>
              <span className="font-semibold text-foreground">{video.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

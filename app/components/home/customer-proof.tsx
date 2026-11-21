import Image from "next/image";

import { cn } from "@/lib/utils";
import { CONTACT, FEEDBACK_PHOTOS, REVIEW_QUOTES } from "./home-data";
import { ArrowLink } from "./arrow-link";
import { Placeholder } from "./placeholder";
import styles from "./home.module.css";

/** Bằng chứng tin cậy: lời khách + điểm Google Maps + dải ảnh khách chạy ngang 1 hàng. */
export function CustomerProof() {
  return (
    <section id="khach" aria-labelledby="khach-title" className="scroll-mt-20 py-section">
      <div className="container-page">
        <div className="mb-block flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="khach-title" className="text-h2 text-foreground">Khách nhận máy tại cửa hàng</h2>
            <p className="mt-2 text-muted-foreground">
              Ảnh thật khách chụp khi nhận máy. <Placeholder hint="số khách đã mua, có nguồn kiểm chứng">[2.800+ khách?]</Placeholder>
            </p>
          </div>
          <ArrowLink href={CONTACT.tiktok} external>Xem thêm trên TikTok</ArrowLink>
        </div>

        <div className="mb-6 grid gap-x-8 lg:grid-cols-[1fr_1fr_auto]">
          {REVIEW_QUOTES.map((quote) => (
            <figure key={quote.id} className="border-t border-border-strong py-5">
              <blockquote className="text-lead font-medium leading-normal tracking-tight">
                “<Placeholder hint="trích lời khách thật">{quote.text}</Placeholder>”
              </blockquote>
              <figcaption className="mt-3 text-caption text-muted-foreground">
                <Placeholder>{quote.who}</Placeholder> · {quote.detail}
              </figcaption>
            </figure>
          ))}
          <div className="flex items-center gap-3 border-t border-border-strong py-5 text-caption text-muted-foreground">
            <span className="font-mono text-[2.75rem] font-semibold leading-none text-foreground">
              <Placeholder hint="điểm Google Maps thật">4.9</Placeholder>
            </span>
            <span>
              trên Google Maps
              <br />
              <Placeholder>[số lượt đánh giá]</Placeholder>
            </span>
          </div>
        </div>

      </div>

      {/* Dải ảnh tràn hết bề ngang màn hình, chạy chậm, rê chuột thì dừng */}
      <div className={cn("overflow-hidden", styles.marquee)}>
        <ul className={styles.marqueeTrack}>
          {[...FEEDBACK_PHOTOS, ...FEEDBACK_PHOTOS].map((file, i) => {
            const isCopy = i >= FEEDBACK_PHOTOS.length;
            return (
              <li key={`${file}-${isCopy ? "b" : "a"}`} aria-hidden={isCopy || undefined} className="shrink-0 pr-4 md:pr-5">
                <span className="relative block h-64 w-48 overflow-hidden rounded-xl bg-surface md:h-80 md:w-60">
                  <Image
                    src={`/feedback/${file}.JPG`}
                    alt={isCopy ? "" : `Khách nhận máy tại Dev Pồ, ảnh ${(i % FEEDBACK_PHOTOS.length) + 1}`}
                    fill
                    sizes="(max-width: 767px) 192px, 240px"
                    loading="lazy"
                    className="object-cover"
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

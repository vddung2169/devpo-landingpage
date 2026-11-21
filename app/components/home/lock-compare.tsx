import Image from "next/image";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { ArrowLink } from "./arrow-link";

interface CompareRow {
  label: string;
  international: string;
  lock: React.ReactNode;
  /** true = dòng khác biệt (không tô xanh "Giống hệt") */
  differs?: boolean;
  highlight?: boolean;
}

const ROWS: CompareRow[] = [
  {
    label: "Chip, camera, màn hình",
    international: "Apple",
    lock: "Giống hệt",
  },
  {
    label: "iCloud, App Store, Face ID",
    international: "Đầy đủ",
    lock: "Giống hệt",
  },
  {
    label: "Cập nhật iOS",
    international: "Bình thường",
    lock: "Bình thường",
    differs: true,
  },
  {
    label: "Lắp sim Việt Nam",
    international: "Lắp thẳng",
    lock: "Lắp thẳng",
    differs: true,
  },
  {
    label: "2 sim 2 sóng",
    international: "Có",
    lock: "Có",
    differs: true,
  },
  {
    label: "Giá cùng đời, cùng dung lượng",
    international: "Cao hơn",
    lock: <strong className="text-sale-ink">Rẻ hơn 3 – 10 triệu</strong>,
    differs: true,
    highlight: true,
  },
];

const IPAD_TYPES = [
  ["Wi-Fi only", "không có khe sim nên không bao giờ dính khoá mạng. Rẻ nhất."],
  [
    "Wi-Fi + Cellular",
    "lắp sim Viettel, Mobifone, Vinaphone là chạy. Đắt hơn 2 – 4 triệu.",
  ],
  [
    "iPad Lock",
    "bản Cellular bị khoá khe sim. Wi-Fi, iCloud, Apple Pencil vẫn dùng đủ 100%.",
  ],
];

/** "Lock hay Quốc tế?" — giúp khách chọn giữa 2 dòng iPhone, kèm phần phân biệt iPad. */
export function LockCompare() {
  return (
    <section
      id="lock"
      aria-labelledby="lock-title"
      className="scroll-mt-20 bg-surface py-section"
    >
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-18">
        <div>
          <h2 id="lock-title" className="text-h2 text-foreground">
            Lock hay Quốc tế? Cùng một chiếc iPhone, khác đúng{" "}
            <span className="text-price">một</span> chỗ.
          </h2>
          <p className="text-lead mt-5 text-pretty text-muted-foreground">
            Cả hai đều do Apple sản xuất, chip, camera, màn hình, iCloud như
            nhau. Bản Quốc tế. Bản Lock nay xài 2 sim 2 sóng chuẩn Quốc tế, có
            thể xài cả sim vật lý và e-sim, đổi lại rẻ hơn 3-10 triệu tùy dòng
            máy.
          </p>
          <ul className="mt-5 space-y-2 text-body">
            <li>
              <strong>Chọn Quốc tế</strong>{" "}
              <span className="text-muted-foreground">
                nếu muốn lắp sim là chạy, không phải nghĩ tới sim ghép.
              </span>
            </li>
            <li>
              <strong>Chọn Lock</strong>{" "}
              <span className="text-muted-foreground">
                nếu muốn đời máy cao hơn với cùng số tiền.
              </span>
            </li>
          </ul>
          <div className="relative mt-7 aspect-[790/500] overflow-hidden rounded-media">
            <Image
              src="/iplock.png"
              alt="Khay sim ghép dùng cho iPhone Lock"
              fill
              sizes="(max-width: 1023px) 92vw, 40vw"
              className="object-cover"
            />
          </div>
          <ArrowLink
            href="/guides/so-sanh-iphone-lock-vs-quoc-te"
            className="mt-3"
          >
            Đọc so sánh Lock và Quốc tế đầy đủ
          </ArrowLink>
        </div>

        <div className="rounded-media bg-background px-5 pb-5 pt-2">
          <table className="w-full border-collapse text-left text-[0.875rem] sm:text-body">
            <caption className="sr-only">
              So sánh iPhone Lock và iPhone Quốc tế
            </caption>
            <thead>
              <tr className="text-[0.75rem] text-muted-foreground">
                <th scope="col" className="w-[38%] py-3 font-semibold">
                  <span className="sr-only">Hạng mục</span>
                </th>
                <th scope="col" className="w-[24%] py-3 font-semibold">
                  Quốc tế
                </th>
                <th scope="col" className="py-3 font-semibold text-foreground">
                  iPhone Lock
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.label}
                  className={cn(
                    "border-t border-border",
                    row.highlight && "border-transparent bg-sale-soft",
                  )}
                >
                  <th
                    scope="row"
                    className={cn(
                      "py-4 pr-3 font-medium",
                      row.highlight && "pl-3",
                    )}
                  >
                    {row.label}
                  </th>
                  <td className="py-4 pr-3 text-muted-foreground">
                    {row.international}
                  </td>
                  <td
                    className={cn(
                      "py-4 pr-3",
                      row.differs
                        ? "font-medium"
                        : "font-semibold text-success",
                    )}
                  >
                    {row.lock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <details className="group mt-4 border-t border-border pt-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
              Đang tìm iPad? Xem iPad Lock khác iPad Wi-Fi thế nào
              <Plus
                className="ml-auto size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-1 list-disc space-y-1.5 pl-5 text-[0.875rem] text-muted-foreground">
              {IPAD_TYPES.map(([name, desc]) => (
                <li key={name}>
                  <strong className="text-foreground">{name}:</strong> {desc}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}

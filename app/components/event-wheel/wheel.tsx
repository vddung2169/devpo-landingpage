"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PrizePublic } from "@/lib/event-wheel";
import { prizeMeta } from "@/lib/event-wheel";

/**
 * Vòng quay.
 *
 * Nguyên tắc: component này KHÔNG bốc thưởng. Nó nhận `landOn` — id giải mà
 * server đã chốt và đã ghi vào sheet — rồi chỉ việc quay cho kim dừng đúng ô đó.
 * Sửa JavaScript ở đây chỉ làm hoạt ảnh sai, không đổi được phần thưởng thật.
 */

const SIZE = 320; // viewBox; co giãn theo container bằng CSS
const R = 150;
const CENTER = SIZE / 2;
const TURNS = 6; // số vòng chạy trước khi giảm tốc
const DURATION = 5200; // ms

/** Toạ độ một điểm trên vành, góc tính theo chiều kim đồng hồ từ 12h. */
function pointAt(angleDeg: number, radius: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function segmentPath(start: number, end: number): string {
  const [x1, y1] = pointAt(start, R);
  const [x2, y2] = pointAt(end, R);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export function Wheel({
  prizes,
  landOn,
  spinning,
  onSettled,
}: {
  prizes: PrizePublic[];
  /** id giải server đã chốt; null khi chưa quay. */
  landOn: string | null;
  spinning: boolean;
  onSettled: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Vì sao phải dùng ref thay vì để useEffect phụ thuộc vào props:
  // modal cha re-render MỖI GIÂY (đồng hồ đếm ngược), và mỗi lần đó `prizes`
  // (mảng vừa .filter) lẫn `onSettled` đều là object mới. Nếu để effect chạy
  // lại theo chúng thì giữa lượt quay nó sẽ tính lại góc dừng với nhiễu mới →
  // vòng quay giật và hẹn giờ kết thúc bị đẩy lùi liên tục, không bao giờ xong.
  // Vì vậy: tính góc dừng ĐÚNG MỘT LẦN cho mỗi lượt quay.
  const startedRef = useRef(false);
  const settledRef = useRef(false);
  const onSettledRef = useRef(onSettled);
  const timerRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  // Chỉ dọn khi component bị bỏ hẳn — KHÔNG dọn mỗi lần props đổi, vì làm vậy
  // sẽ xoá luôn hẹn giờ kết thúc lượt quay đang chạy.
  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const seg = prizes.length > 0 ? 360 / prizes.length : 360;

  // Hoạt ảnh rút gọn cho người bật "giảm chuyển động" trong hệ điều hành.
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const duration = reduced ? 900 : DURATION;

  useEffect(() => {
    if (!spinning || !landOn || prizes.length === 0) return;
    if (startedRef.current) return; // lượt quay này đã chốt góc dừng rồi

    const index = prizes.findIndex((p) => p.id === landOn);
    if (index < 0) {
      // Giải server trả về không có trên vòng (vd vừa hết hàng ở lượt khác):
      // bỏ hoạt ảnh, sang luôn màn kết quả — kết quả thật vẫn đúng.
      startedRef.current = true;
      settledRef.current = true;
      onSettledRef.current();
      return;
    }

    startedRef.current = true;

    // Tâm ô `index` nằm ở góc (index + 0.5) * seg trong hệ toạ độ của vòng.
    // Muốn tâm đó trùng kim (12h) sau khi quay R độ: R = 360*k - tâm.
    // Thêm nhiễu nhỏ trong lòng ô để mỗi lượt dừng một chỗ khác nhau, trông thật hơn.
    const center = (index + 0.5) * seg;
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const target = 360 * (reduced ? 2 : TURNS) - center + jitter;

    setAnimate(true);
    // Để trình duyệt kịp đặt transition trước khi đổi transform.
    rafRef.current = window.requestAnimationFrame(() => setRotation(target));
    timerRef.current = window.setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      onSettledRef.current();
    }, duration + 120);
  }, [spinning, landOn, prizes, seg, duration, reduced]);

  return (
    // max-w chặn cả theo chiều cao khung nhìn (44vh) để màn hình thấp
    // như laptop 1366x768 không bị tràn phải cuộn.
    <div className="relative mx-auto aspect-square w-full max-w-[320px] select-none lg:max-w-[min(384px,44vh)]">
      {/* Kim chỉ thưởng — cố định phía trên, không quay cùng vòng. */}
      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[2px]">
        <div
          className="h-5 w-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
          style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
          aria-hidden
        />
      </div>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
        role="img"
        aria-label={`Vòng quay ${prizes.length} phần thưởng`}
      >
        {/* Vành ngoài */}
        <circle cx={CENTER} cy={CENTER} r={R + 5} fill="rgba(255,255,255,0.14)" />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
            transition: animate
              ? `transform ${duration}ms cubic-bezier(0.12, 0.72, 0.1, 1)`
              : undefined,
            willChange: "transform",
          }}
        >
          {prizes.map((p, i) => {
            const meta = prizeMeta(p.id);
            const start = i * seg;
            const end = start + seg;
            const mid = start + seg / 2;
            const [tx, ty] = pointAt(mid, R * 0.66);
            // Nhãn ở nửa dưới vòng sẽ bị lộn ngược nếu chỉ xoay theo bán kính.
            // Lật thêm 180° cho các ô đó để chữ luôn đọc xuôi; khi lật thì trục y
            // cục bộ đảo chiều nên phải đổi dấu toạ độ để icon vẫn nằm phía ngoài.
            const flipped = mid > 90 && mid < 270;
            const iconY = flipped ? 6 : -6;
            const textY = flipped ? -13 : 13;
            return (
              <g key={p.id}>
                <path
                  d={segmentPath(start, end)}
                  fill={meta.mau}
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth={1}
                />
                {/* Nhãn dựng theo bán kính để đọc được ở mọi góc */}
                <g transform={`translate(${tx} ${ty}) rotate(${mid + (flipped ? 180 : 0)})`}>
                  <text
                    textAnchor="middle"
                    y={iconY}
                    fontSize={16}
                    style={{ pointerEvents: "none" }}
                  >
                    {meta.icon}
                  </text>
                  <text
                    textAnchor="middle"
                    y={textY}
                    fontSize={13}
                    fontWeight={600}
                    fill={meta.chu}
                    style={{ pointerEvents: "none" }}
                  >
                    {meta.short}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Trục giữa */}
        <circle cx={CENTER} cy={CENTER} r={30} fill="#ffffff" />
        <circle cx={CENTER} cy={CENTER} r={30} fill="none" stroke="rgba(0,0,0,0.08)" />
        <text
          x={CENTER}
          y={CENTER - 2}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill="#06142b"
          letterSpacing={0.5}
        >
          DEV PỒ
        </text>
        <text
          x={CENTER}
          y={CENTER + 11}
          textAnchor="middle"
          fontSize={8}
          fill="#6b7280"
          letterSpacing={0.8}
        >
          LUCKY
        </text>
      </svg>
    </div>
  );
}

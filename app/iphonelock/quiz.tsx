"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, Info, RotateCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type QuizKey = "budget" | "tech" | "travel";
type QuizAnswers = Record<QuizKey, string>;

/**
 * 3 câu hỏi của bài trắc nghiệm. Trước đây mỗi câu được chép tay thành một khối
 * JSX riêng dài ~30 dòng với y hệt class; giờ chỉ còn dữ liệu.
 */
const QUESTIONS: {
  key: QuizKey;
  title: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "budget",
    title: "Ngân sách của bạn thế nào?",
    options: [
      { value: "low", label: "Hạn hẹp, muốn cấu hình mạnh nhất với giá thấp nhất." },
      { value: "high", label: "Thoải mái, sẵn sàng chi thêm để đổi lấy sự yên tâm." },
    ],
  },
  {
    key: "tech",
    title: "Bạn am hiểu công nghệ đến mức nào?",
    options: [
      { value: "yes", label: "Thích mày mò, có thể tự xử lý các lỗi SIM ghép cơ bản." },
      { value: "no", label: "Chỉ muốn máy hoạt động 100% ổn định, sợ lỗi vặt." },
    ],
  },
  {
    key: "travel",
    title: "Bạn có thường xuyên thay đổi SIM không?",
    options: [
      { value: "no", label: "Rất ít, tôi dùng cố định 1 số điện thoại lâu dài." },
      { value: "yes", label: "Thường xuyên đi công tác, thay SIM liên tục." },
    ],
  },
];

const RESULT_STEP = QUESTIONS.length + 1;

export function IphoneLockQuiz() {
  // 0 = màn hình mở đầu, 1..3 = câu hỏi, 4 = kết quả
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    budget: "",
    tech: "",
    travel: "",
  });

  const handleAnswer = (key: QuizKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setQuizStep((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setAnswers({ budget: "", tech: "", travel: "" });
  };

  // Giữ nguyên tiêu chí gợi ý cũ: chỉ dựa trên mức độ am hiểu công nghệ.
  const isLockRecommended = answers.tech === "yes";

  const question = QUESTIONS[quizStep - 1];

  return (
    <section id="quiz" className="relative w-full overflow-hidden py-section">
      {/* Ảnh nền + lớp phủ tối để chữ trắng luôn đủ tương phản */}
      <Image
        src="/background-2.jpg"
        alt=""
        aria-hidden="true"
        fill
        loading="lazy"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/80" aria-hidden="true" />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl">
          <div className="mb-block text-center text-white">
            <h2 className="text-h1 text-balance">Tư vấn chọn máy</h2>
            <p className="text-lead mt-3 text-balance text-white/80">
              Dành 30 giây trả lời để xem iPhone Lock có hợp với bạn không.
            </p>
          </div>

          <div className="flex min-h-[26rem] flex-col justify-center rounded-media bg-background p-6 shadow-e3 sm:p-10">
            {/* --- Màn hình mở đầu --- */}
            {quizStep === 0 && (
              <div className="flex flex-col items-center gap-6 text-center duration-500 animate-in fade-in zoom-in-95">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-surface">
                  <Info className="size-8 text-foreground" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h2 text-foreground">
                    Bắt đầu bài trắc nghiệm
                  </h3>
                  <p className="text-body text-muted-foreground">
                    Dev Pồ gợi ý dựa trên nhu cầu thực tế của bạn.
                  </p>
                </div>
                <Button size="lg" onClick={() => setQuizStep(1)}>
                  Bắt đầu ngay
                </Button>
              </div>
            )}

            {/* --- Các câu hỏi --- */}
            {question && (
              <div className="flex flex-col gap-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col items-center gap-3">
                  <Badge variant="neutral">
                    Câu hỏi {quizStep}/{QUESTIONS.length}
                  </Badge>
                  <h3 className="text-h2 text-balance text-center text-foreground">
                    {question.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswer(question.key, option.value)}
                      className="rounded-media bg-surface px-5 py-4 text-left text-body text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- Kết quả --- */}
            {quizStep === RESULT_STEP && (
              <div className="flex flex-col items-center gap-6 text-center duration-500 animate-in fade-in zoom-in-95">
                {isLockRecommended ? (
                  <>
                    <span className="flex size-16 items-center justify-center rounded-full bg-success-soft">
                      <CheckCircle
                        className="size-8 text-success-ink"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-h2 text-foreground">
                        Bạn nên chọn iPhone Lock
                      </h3>
                      <p className="text-body text-balance text-muted-foreground">
                        Với ngân sách tối ưu và sự am hiểu công nghệ, iPhone Lock
                        là lựa chọn kinh tế giúp bạn trải nghiệm cấu hình cao
                        nhất.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex size-16 items-center justify-center rounded-full bg-info-soft">
                      <ShieldCheck
                        className="size-8 text-info-ink"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-h2 text-foreground">
                        iPhone Quốc tế hợp với bạn hơn
                      </h3>
                      <p className="text-body text-balance text-muted-foreground">
                        Bạn ưu tiên sự ổn định và ngại rắc rối, iPhone Quốc tế
                        giúp bạn tiết kiệm thời gian và hoàn toàn yên tâm.
                      </p>
                    </div>
                  </>
                )}

                <Button variant="ghost" onClick={resetQuiz}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Làm lại bài trắc nghiệm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

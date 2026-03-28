"use client";

import React, { useState } from "react";
import { CheckCircle, Info, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function App() {
  const [quizStep, setQuizStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result

  type QuizAnswers = {
    budget: "low" | "high" | "";
    tech: "yes" | "no" | "";
    travel: "yes" | "no" | "";
  };

  const [answers, setAnswers] = useState<QuizAnswers>({
    budget: "",
    tech: "",
    travel: "",
  });

  const handleAnswer = (
    key: keyof QuizAnswers,
    value: "low" | "high" | "yes" | "no" | ""
  ) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    setQuizStep((prev) => prev + 1);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setAnswers({ budget: "", tech: "", travel: "" });
  };

  const isLockRecommended = () => {
    return answers.tech === "yes";
  };

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      {/* Interactive Quiz Section */}
      <section
        id="quiz"
        className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-cover bg-center px-4 py-24 sm:py-32"
        style={{ backgroundImage: "url('/background-2.jpg')" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-black/80"></div>

        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <div className="mb-10 text-center text-white sm:mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
              Tư vấn mua máy
            </h2>
            <p className="text-lg opacity-90 sm:text-xl text-balance">
              Dành 30 giây trả lời để xem bạn có nên mạo hiểm với iPhone Lock?
            </p>
          </div>

          <Card className="flex min-h-[400px] flex-col justify-center border-0 p-6 shadow-2xl sm:p-12">
            {quizStep === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-6">
                  <Info className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Bắt đầu bài trắc nghiệm
                  </h3>
                  <p className="text-muted-foreground">
                    DEV PỒ sẽ dựa trên nhu cầu thực tế của bạn.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => setQuizStep(1)}
                  className="w-full sm:w-auto min-w-[200px] cursor-pointer"
                >
                  Bắt đầu ngay
                </Button>
              </div>
            )}

            {quizStep === 1 && (
              <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center space-y-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    Câu hỏi 1/3
                  </Badge>
                  <h3 className="text-center text-2xl font-bold tracking-tight">
                    Ngân sách của bạn thế nào?
                  </h3>
                </div>
                <div className="grid gap-4">
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => handleAnswer("budget", "low")}
                  >
                    Hạn hẹp, muốn cấu hình mạnh nhất với giá thấp nhất.
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => handleAnswer("budget", "high")}
                  >
                    Thoải mái, sẵn sàng chi thêm để đổi lấy sự yên tâm.
                  </Button>
                </div>
              </div>
            )}

            {quizStep === 2 && (
              <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center space-y-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    Câu hỏi 2/3
                  </Badge>
                  <h3 className="text-center text-2xl font-bold tracking-tight">
                    Bạn am hiểu công nghệ đến mức nào?
                  </h3>
                </div>
                <div className="grid gap-4">
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => handleAnswer("tech", "yes")}
                  >
                    Thích mày mò, có thể tự xử lý các lỗi SIM ghép cơ bản.
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => handleAnswer("tech", "no")}
                  >
                    Chỉ muốn máy hoạt động 100% ổn định, sợ lỗi vặt.
                  </Button>
                </div>
              </div>
            )}

            {quizStep === 3 && (
              <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col items-center space-y-4">
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    Câu hỏi 3/3
                  </Badge>
                  <h3 className="text-center text-2xl font-bold tracking-tight">
                    Bạn có thường xuyên thay đổi SIM không?
                  </h3>
                </div>
                <div className="grid gap-4">
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => setQuizStep(4)}
                  >
                    Rất ít, tôi dùng cố định 1 số điện thoại lâu dài.
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto w-full cursor-pointer justify-start whitespace-normal p-4 text-left text-base font-normal hover:bg-primary/5 hover:border-primary/50 transition-colors sm:p-6"
                    onClick={() => {
                      setAnswers({ ...answers, travel: "yes" });
                      setQuizStep(4);
                    }}
                  >
                    Thường xuyên đi công tác, thay SIM liên tục.
                  </Button>
                </div>
              </div>
            )}

            {quizStep === 4 && (
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
                {isLockRecommended() ? (
                  <>
                    <div className="flex items-center justify-center rounded-full bg-green-500/10 p-6">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-500">
                        Bạn nên chọn iPhone Lock!
                      </h3>
                      <p className="text-muted-foreground text-balance">
                        Với ngân sách tối ưu và sự am hiểu công nghệ, iPhone
                        Lock sẽ là lựa chọn kinh tế giúp bạn trải nghiệm cấu
                        hình cao nhất.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center rounded-full bg-blue-500/10 p-6">
                      <ShieldCheck className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                        iPhone Quốc tế là chân ái!
                      </h3>
                      <p className="text-muted-foreground text-balance">
                        Bạn ưu tiên sự ổn định và ngại rắc rối, iPhone Quốc tế
                        sẽ giúp bạn tiết kiệm thời gian và hoàn toàn yên tâm.
                      </p>
                    </div>
                  </>
                )}
                <Button
                  variant="ghost"
                  className="mt-4 cursor-pointer"
                  onClick={resetQuiz}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Làm lại bài kiểm tra
                </Button>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
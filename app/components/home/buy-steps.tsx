import { CONTACT } from "./home-data";
import { Placeholder } from "./placeholder";

const STEPS = [
  { n: "01", title: "Nhắn đời máy bạn muốn", body: <>Qua Zalo hoặc Messenger. Dev Pồ gửi ảnh, video máy thật kèm giá chốt, không báo giá ảo.</> },
  { n: "02", title: "Xem máy, test sóng", body: <>Ghé {CONTACT.address.split(",")[0]}, hoặc gọi video để xem máy, kiểm tra IMEI, pin, sóng sim của bạn.</> },
  { n: "03", title: "Nhận máy, trả tiền sau", body: <>Lấy tại cửa hàng hoặc ship toàn quốc miễn phí. Kiểm tra máy rồi mới thanh toán <Placeholder hint="có áp dụng với mọi đơn vị vận chuyển?">[xác nhận]</Placeholder>.</> },
  { n: "04", title: "Lỗi sim? Dev Pồ fix", body: <>Mất sóng sau khi cập nhật iOS, lỗi sim ghép: được xử lý miễn phí trọn đời máy.</> },
];

/** 4 bước mua — dọc trên mobile, ngang trên desktop, nối bằng một đường kẻ. */
export function BuySteps() {
  return (
    <section id="mua" aria-labelledby="mua-title" className="scroll-mt-20 py-section">
      <div className="container-page">
        <div className="mb-block max-w-2xl">
          <h2 id="mua-title" className="text-h2 text-foreground">Mua máy ở Dev Pồ diễn ra thế nào</h2>
          <p className="mt-2 text-muted-foreground">Ở xa hay ở gần đều cùng một quy trình, chỉ khác bước nhận máy.</p>
        </div>
        <ol className="grid lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="relative pb-8 pl-13 before:absolute before:bottom-1 before:left-[0.95rem] before:top-9 before:w-px before:bg-border-strong last:before:hidden lg:pl-0 lg:pt-13 lg:before:left-11 lg:before:right-[-2rem] lg:before:top-4 lg:before:h-px lg:before:w-auto"
            >
              <span className="absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-primary font-mono text-[0.75rem] font-semibold text-primary-foreground">
                {step.n}
              </span>
              <h3 className="text-h3 text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-pretty text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

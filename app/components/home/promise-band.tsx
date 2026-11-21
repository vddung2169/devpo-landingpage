const PROMISES = [
  { title: "Kiểm tra kỹ", desc: "iCloud, MDM, Pin trước khi giao máy" },
  {
    title: "Fix sim trọn đời",
    desc: "Cho máy Lock, kể cả sau khi cập nhật iOS",
  },
  { title: "Free ship", desc: "Giao toàn quốc, kiểm hàng khi nhận" },
  { title: "Trả góp 0%", desc: "Qua thẻ tín dụng và app tài chính" },
];

/** Dải 4 cam kết, đứng yên (thay cho thanh chữ chạy). */
export function PromiseBand() {
  return (
    <section
      aria-label="Cam kết của Dev Pồ"
      className="bg-primary text-primary-foreground"
    >
      <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((item) => (
          <li
            key={item.title}
            className="flex flex-col gap-0.5 py-5 pr-3 lg:px-6 lg:py-6 lg:first:pl-0 lg:[&+li]:border-l lg:[&+li]:border-primary-foreground/15"
          >
            <strong className="text-lg font-bold tracking-tight">
              {item.title}
            </strong>
            <span className="text-caption opacity-70">{item.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

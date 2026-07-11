// Dữ liệu & công thức tính trả góp cho công cụ tham khảo tại /cong-cu-mua-iphone#tra-gop.
// Tách khỏi UI để dễ cập nhật lãi suất/ưu đãi khi chính sách đối tác thay đổi.
//
// LƯU Ý: Toàn bộ con số ở đây chỉ mang tính THAM KHẢO. Số tiền thực tế tùy chính
// sách từng đối tác/ngân hàng tại thời điểm mua.

/** 3 hình thức trả góp được hỗ trợ trong công cụ. */
export type TraGopMethod = "hd-mirae" | "icloud" | "the-tin-dung";

/* -------------------------------------------------------------------------- */
/* 1. HD Saison / Mirae Asset                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Lãi suất cơ bản theo kỳ hạn, áp dụng trên TỔNG khoản vay (đã làm tròn %).
 * Ví dụ 12 tháng: rate = 0.115 => lãi = khoản vay × 11.5%.
 */
export const hdSaisonMiraeRates: { months: number; rate: number }[] = [
  { months: 6, rate: 0.2 },
  { months: 8, rate: 0.16 },
  { months: 12, rate: 0.115 },
];

/** Mức trả trước tối thiểu khi góp qua HD Saison / Mirae Asset. */
export const HD_MIRAE_MIN_DOWN_PAYMENT = 0.2;

/** Kết quả tính lãi dạng "một lần" (HD Saison / Mirae). */
export interface TraGopResult {
  /** Tiền lãi ước tính trên toàn kỳ hạn. */
  interest: number;
  /** Tổng tiền phải trả = khoản vay + tiền lãi. */
  total: number;
  /** Số tiền trả mỗi tháng (tổng / số tháng). */
  monthly: number;
}

/**
 * Tính trả góp qua HD Saison / Mirae Asset.
 *   Tiền lãi  = Khoản vay × Lãi suất(%) theo kỳ hạn
 *   Tổng tiền = Khoản vay + Tiền lãi
 */
export function calcHdSaisonMirae(loanAmount: number, months: number): TraGopResult {
  const found = hdSaisonMiraeRates.find((r) => r.months === months);
  const rate = found?.rate ?? 0;
  const interest = Math.round(loanAmount * rate);
  const total = loanAmount + interest;
  const monthly = months > 0 ? Math.round(total / months) : 0;
  return { interest, total, monthly };
}

/* -------------------------------------------------------------------------- */
/* 2. Trả góp qua iCloud                                                        */
/* -------------------------------------------------------------------------- */

/** Lãi suất iCloud: 8%/tháng trên nợ gốc. */
export const ICLOUD_MONTHLY_RATE = 0.08;

/** Mức trả trước tối thiểu khi góp qua iCloud. */
export const ICLOUD_MIN_DOWN_PAYMENT = 0.5;

/** Các kỳ hạn iCloud cho phép chọn: 1–6 tháng. */
export const icloudTerms: number[] = [1, 2, 3, 4, 5, 6];

/**
 * Tính trả góp qua iCloud (8%/tháng trên nợ gốc).
 *   Lãi/tháng = Khoản vay × 8%
 *   Tổng lãi  = Lãi/tháng × Số tháng
 *   Tổng tiền = Khoản vay + Tổng lãi
 */
export function calcICloud(loanAmount: number, months: number): TraGopResult {
  const monthlyInterest = Math.round(loanAmount * ICLOUD_MONTHLY_RATE);
  const interest = monthlyInterest * months;
  const total = loanAmount + interest;
  const monthly = months > 0 ? Math.round(total / months) : 0;
  return { interest, total, monthly };
}

/* -------------------------------------------------------------------------- */
/* 3. Trả góp qua thẻ tín dụng ngân hàng (bảng tham khảo tĩnh)                  */
/* -------------------------------------------------------------------------- */

export interface BankCreditCardOption {
  bank: string;
  model: string;
  fee: string;
  term: string;
}

/**
 * Bảng tham khảo tĩnh — chỉ để khách xem qua, KHÔNG tính toán theo khoản vay
 * cụ thể. Ưu đãi thay đổi theo thời gian & chính sách từng ngân hàng/đối tác.
 */
export const bankCreditCardOptions: BankCreditCardOption[] = [
  {
    bank: "Sacombank",
    model: "0% lãi + phí chuyển đổi",
    fee: "~1.99% (3 tháng), tăng dần theo kỳ hạn",
    term: "3–24 tháng",
  },
  {
    bank: "Techcombank",
    model: "0% lãi + phí chuyển đổi",
    fee: "~1.1%/tháng × số tháng",
    term: "3–12 (48 ở vài đối tác)",
  },
  {
    bank: "ACB",
    model: "0% lãi + phí chuyển đổi",
    fee: "3th: 0% / 6th: 3.99% / 9th: 5.99% / 12th: 7.99%",
    term: "3–12 tháng",
  },
  {
    bank: "VPBank",
    model: "0% lãi + phí, hoặc không phí + lãi tháng",
    fee: "Phí 2–3% hoặc lãi 0.5–1%/tháng",
    term: "3–36 tháng",
  },
  {
    bank: "TPBank",
    model: "0% lãi + phí chuyển đổi",
    fee: "Phí cố định thấp (~55.000đ)",
    term: "3/6/9/12 tháng",
  },
  {
    bank: "VIB",
    model: "0% lãi ban đầu + phí",
    fee: "Phí dao động theo kỳ hạn (xác nhận tại quầy)",
    term: "3–36 tháng",
  },
  {
    bank: "HSBC",
    model: "Phí chuyển đổi (một số đối tác 0%)",
    fee: "~2–4.5%",
    term: "3–36 tháng",
  },
  {
    bank: "Shinhan Bank",
    model: "0% lãi, không phí (theo đối tác)",
    fee: "0%",
    term: "đến 12 tháng",
  },
  {
    bank: "MB Bank",
    model: "0% lãi, phí quản lý",
    fee: "~0.8%/tháng",
    term: "3/6/9/12/18/24 tháng",
  },
  {
    bank: "SHB",
    model: "0% tại đối tác SHB",
    fee: "Phí áp dụng ngoài đối tác",
    term: "—",
  },
  {
    bank: "BIDV",
    model: "0% lãi (nếu thanh toán đúng hạn)",
    fee: "Phí ~2.99% (6 tháng)",
    term: "theo kỳ hạn",
  },
  {
    bank: "HDBank",
    model: "0% lãi + phí",
    fee: "~3.5% (3–6 tháng)",
    term: "3–36 tháng",
  },
  {
    bank: "Eximbank",
    model: "0% lãi, miễn phí tại đối tác; hoặc lãi ưu đãi",
    fee: "Lãi giảm dần: 3th 1.13%/th → 12th 0.92%/th",
    term: "3–12 tháng",
  },
];

/** Số tiền vay ví dụ mặc định khi mở công cụ. */
export const DEFAULT_LOAN_AMOUNT = 20_000_000;

/** Disclaimer chung, hiển thị ở mọi hình thức. */
export const TRA_GOP_DISCLAIMER =
  "Công cụ chỉ mang tính tham khảo, số tiền thực tế tùy chính sách từng đối tác tại thời điểm mua.";

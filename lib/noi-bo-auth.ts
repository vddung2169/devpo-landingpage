// Cấu hình cổng PIN cho khu vực nội bộ (/noi-bo/*).
// Các hằng số ở đây chỉ dùng phía server (middleware + server action) — KHÔNG
// import từ client component để mã PIN không bị lộ trong bundle trình duyệt.

/** Mã PIN mở khoá khu vực nội bộ. Đổi ở đây khi cần. */
export const NOI_BO_PIN = "8888";

/** Tên cookie đánh dấu đã mở khoá. */
export const NOI_BO_COOKIE = "noibo_auth";

/**
 * Giá trị cookie khi đã mở khoá — KHÔNG phải mã PIN, để PIN không nằm ở client.
 * Đổi giá trị này sẽ vô hiệu mọi phiên đăng nhập cũ.
 */
export const NOI_BO_TOKEN = "devpo-noibo-unlocked-v1";

/** Trang nhập PIN. */
export const NOI_BO_LOGIN_PATH = "/noi-bo/dang-nhap";

/** Trang mặc định sau khi mở khoá. */
export const NOI_BO_HOME_PATH = "/noi-bo/tra-gop";

/** Chỉ cho phép redirect nội bộ hợp lệ (tránh open-redirect). */
export function safeNoiBoPath(from: string | undefined | null): string {
  if (
    typeof from === "string" &&
    from.startsWith("/noi-bo") &&
    !from.startsWith(NOI_BO_LOGIN_PATH)
  ) {
    return from;
  }
  return NOI_BO_HOME_PATH;
}

import { NextResponse, type NextRequest } from "next/server";
import {
  NOI_BO_COOKIE,
  NOI_BO_TOKEN,
  NOI_BO_LOGIN_PATH,
  safeNoiBoPath,
} from "@/lib/noi-bo-auth";

/**
 * Cổng PIN cho khu vực nội bộ: chặn mọi route /noi-bo/* nếu chưa mở khoá,
 * chuyển hướng về trang nhập PIN. Việc kiểm tra diễn ra ở server (edge) nên
 * trang nội bộ không hề render khi chưa đăng nhập.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed =
    request.cookies.get(NOI_BO_COOKIE)?.value === NOI_BO_TOKEN;
  const isLoginPage = pathname === NOI_BO_LOGIN_PATH;

  // Đã mở khoá mà vào lại trang PIN -> đưa thẳng vào khu nội bộ
  if (isLoginPage) {
    if (authed) {
      const from = request.nextUrl.searchParams.get("from");
      return NextResponse.redirect(new URL(safeNoiBoPath(from), request.url));
    }
    return NextResponse.next();
  }

  // Route nội bộ khác mà chưa mở khoá -> về trang PIN, nhớ đường dẫn gốc
  if (!authed) {
    const url = new URL(NOI_BO_LOGIN_PATH, request.url);
    url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/noi-bo/:path*"],
};

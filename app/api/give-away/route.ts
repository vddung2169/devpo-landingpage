import { NextRequest, NextResponse } from "next/server";
import { mockGiveaway, mockRegister } from "@/lib/giveaway-mock";

// Route proxy giữa client và Google Apps Script Web App.
// Lý do proxy phía server:
//  - GIVEAWAY_API không lộ trong bundle client
//  - không dính CORS (server-to-server)
//  - tập trung xử lý lỗi & fallback mock
export const dynamic = "force-dynamic";

/** GET: lấy trạng thái giveaway (+ tra vé nếu có ?phone=). */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const mock = searchParams.get("mock");
  const api = process.env.GIVEAWAY_API;
  const allowMock = !api || process.env.NODE_ENV !== "production";

  if (!api || (mock && allowMock)) {
    return NextResponse.json(mockGiveaway(mock ?? "open", phone));
  }

  try {
    const url = new URL(api);
    if (phone) url.searchParams.set("phone", phone);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Máy chủ giveaway trả lỗi (${res.status}).` },
        { status: 502 },
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không kết nối được máy chủ giveaway." },
      { status: 502 },
    );
  }
}

/** POST: đăng ký tham gia. Body là chuỗi JSON {name, phone}. */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const api = process.env.GIVEAWAY_API;

  if (!api) {
    return NextResponse.json(mockRegister(body));
  }

  try {
    // Gửi text/plain là chủ đích: né preflight CORS của Apps Script.
    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không gửi được đăng ký. Vui lòng thử lại." },
      { status: 502 },
    );
  }
}

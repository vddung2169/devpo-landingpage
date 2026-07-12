import { NextRequest, NextResponse } from "next/server";
import { NOI_BO_COOKIE, NOI_BO_TOKEN } from "@/lib/noi-bo-auth";
import { mockDraw } from "@/lib/giveaway-mock";

// Quay thưởng — chỉ dành cho admin.
// Bảo mật:
//  - MÃ QUẢN TRỊ (GIVEAWAY_ADMIN_KEY) đọc từ env phía server, KHÔNG bao giờ ra client.
//  - Chỉ cho phép khi request có cookie nội bộ hợp lệ (tái dùng cổng PIN /noi-bo).
export const dynamic = "force-dynamic";

const API = process.env.GIVEAWAY_API;
const ADMIN_KEY = process.env.GIVEAWAY_ADMIN_KEY;

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get(NOI_BO_COOKIE)?.value === NOI_BO_TOKEN;
}

/** GET: client hỏi "tôi có phải admin không" để quyết định hiện nút quay thưởng. */
export async function GET(req: NextRequest) {
  return NextResponse.json({ admin: isAdmin(req) });
}

/** POST: thực hiện quay thưởng cho giveawayId. */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: "Bạn không có quyền quay thưởng." },
      { status: 401 },
    );
  }

  let giveawayId = "";
  try {
    const parsed = (await req.json()) as { giveawayId?: string };
    giveawayId = parsed.giveawayId ?? "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Thiếu giveawayId." },
      { status: 400 },
    );
  }
  if (!giveawayId) {
    return NextResponse.json(
      { ok: false, error: "Thiếu giveawayId." },
      { status: 400 },
    );
  }

  // Chưa nối backend thật -> quay thử bằng mock (chỉ ở môi trường dev).
  if (!API || !ADMIN_KEY) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(mockDraw(giveawayId));
    }
    return NextResponse.json(
      { ok: false, error: "Chưa cấu hình GIVEAWAY_API / GIVEAWAY_ADMIN_KEY." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "draw", giveawayId, key: ADMIN_KEY }),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không gọi được máy chủ để quay thưởng." },
      { status: 502 },
    );
  }
}

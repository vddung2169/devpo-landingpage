import { NextRequest, NextResponse } from "next/server";
import { NOI_BO_COOKIE, NOI_BO_TOKEN } from "@/lib/noi-bo-auth";
import { mockDraw } from "@/lib/giveaway-mock";

// Quay thưởng — chỉ dành cho admin.
// Bảo mật:
//  - MÃ QUẢN TRỊ (GIVEAWAY_ADMIN_KEY) đọc từ env phía server, KHÔNG bao giờ ra client.
//  - Chỉ cho phép khi request có cookie nội bộ hợp lệ (tái dùng cổng PIN /noi-bo).
export const dynamic = "force-dynamic";

// Đọc từ env.
// (Đọc trực tiếp bên trong function để Next.js/Turbopack luôn lấy bản mới nhất khi restart)
const DEFAULT_SHEET_ID = "10sDZgyu1SDwx33q5lrnQSPmA-8dVpfHx4Jeee_2cvYY";
const DEFAULT_ENTRIES_SHEET = "Danhsach";

type DrawResponse = {
  ok?: boolean;
  error?: string;
  winner?: { name: string; phone: string; ticket: string } | null;
  names?: unknown;
  [key: string]: unknown;
};

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get(NOI_BO_COOKIE)?.value === NOI_BO_TOKEN;
}

function uniqueNames(names: unknown): string[] {
  if (!Array.isArray(names)) return [];
  return Array.from(
    new Set(
      names
        .map((name) => (typeof name === "string" ? name.trim() : ""))
        .filter(Boolean),
    ),
  );
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findNameColumn(header: string[]): number {
  const idx = header.findIndex((cell) => {
    const h = normalizeHeader(cell);
    return h.includes("ho ten") || h === "ten" || h.includes("name");
  });
  return idx >= 0 ? idx : 0;
}

async function fetchSheetNames(): Promise<string[]> {
  const sheetId = process.env.GIVEAWAY_SHEET_ID || DEFAULT_SHEET_ID;
  const sheetName = process.env.GIVEAWAY_ENTRIES_SHEET || DEFAULT_ENTRIES_SHEET;
  const url = new URL(
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`,
  );
  url.searchParams.set("tqx", "out:csv");
  url.searchParams.set("sheet", sheetName);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const rows = parseCsv(await res.text()).filter((row) =>
    row.some((cell) => cell.trim()),
  );
  if (rows.length < 2) return [];

  const nameCol = findNameColumn(rows[0]);
  return uniqueNames(rows.slice(1).map((row) => row[nameCol] ?? ""));
}

async function withFallbackNames(data: DrawResponse): Promise<DrawResponse> {
  const names = uniqueNames(data.names);
  if (names.length > 1) return { ...data, names };

  const fallbackNames = await fetchSheetNames();
  if (fallbackNames.length > 1) return { ...data, names: fallbackNames };

  return { ...data, names };
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
  if (!process.env.GIVEAWAY_API || !process.env.GIVEAWAY_ADMIN_KEY) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(mockDraw(giveawayId));
    }
    return NextResponse.json(
      { ok: false, error: "Chưa cấu hình GIVEAWAY_API / GIVEAWAY_ADMIN_KEY." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(process.env.GIVEAWAY_API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "draw", giveawayId, key: process.env.GIVEAWAY_ADMIN_KEY }),
      cache: "no-store",
    });
    const data = await withFallbackNames((await res.json()) as DrawResponse);
    return NextResponse.json(data, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Không gọi được máy chủ để quay thưởng." },
      { status: 502 },
    );
  }
}

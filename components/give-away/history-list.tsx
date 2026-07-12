"use client";

import { Gift, Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Giveaway } from "@/lib/giveaway";

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Cột lịch sử các đợt giveaway đã kết thúc. Mới nhất lên đầu. */
export function HistoryList({ history }: { history: Giveaway[] }) {
  if (!history || history.length === 0) return null;

  return (
    <aside aria-labelledby="ga-history-heading">
      <h2
        id="ga-history-heading"
        className="mb-4 text-lg font-bold tracking-tight text-foreground"
      >
        Các đợt đã trao thưởng
      </h2>
      <ol className="flex flex-col gap-3">
        {history.map((g) => (
          <li key={g.id}>
            <Card className="gap-0 py-0">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {g.title}
                  </h3>
                  {g.endAt && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(g.endAt)}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Gift className="h-3.5 w-3.5 shrink-0" />
                  <span>{g.prize}</span>
                </div>

                {g.winner && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="font-medium text-foreground">
                      {g.winner.name}
                    </span>
                    <span className="text-muted-foreground">
                      · {g.winner.phone}
                    </span>
                  </div>
                )}

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>{g.totalEntries.toLocaleString("vi-VN")} người tham gia</span>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </aside>
  );
}

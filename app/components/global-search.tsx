"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Smartphone,
  BookOpen,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  searchDocs,
  searchIndex,
  type SearchDocType,
  type SearchDoc,
} from "@/lib/search-index";

// Icon + nhãn nhóm theo loại tài liệu
const TYPE_META: Record<
  SearchDocType,
  { label: string; icon: typeof Smartphone }
> = {
  product: { label: "Sản phẩm", icon: Smartphone },
  guide: { label: "Cẩm nang", icon: BookOpen },
  page: { label: "Trang", icon: FileText },
};

// Thứ tự hiển thị nhóm trong kết quả
const GROUP_ORDER: SearchDocType[] = ["product", "guide", "page"];

// Gợi ý khi ô tìm kiếm còn trống: vài trang tĩnh + sản phẩm/bài viết đầu tiên
const SUGGESTIONS: SearchDoc[] = [
  ...searchIndex.filter((d) => d.type === "page").slice(0, 3),
  ...searchIndex.filter((d) => d.type === "product").slice(0, 3),
  ...searchIndex.filter((d) => d.type === "guide").slice(0, 2),
];

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Mở nhanh bằng ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Reset truy vấn mỗi khi đóng để lần mở sau bắt đầu sạch
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const docs = query.trim() ? searchDocs(query, 12) : SUGGESTIONS;
    // Gom theo loại để render thành từng nhóm có tiêu đề
    return GROUP_ORDER.map((type) => ({
      type,
      items: docs.filter((d) => d.type === type),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      {/* Trigger: desktop hiện như ô input, mobile chỉ là icon */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Tìm kiếm"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20",
          // mobile: nút icon tròn; md+: ô tìm kiếm rộng
          "h-9 w-9 justify-center md:h-9 md:w-56 md:justify-start md:px-3 lg:w-64",
        )}
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden flex-1 truncate whitespace-nowrap text-left text-sm md:inline">
          Tìm sản phẩm, cẩm nang…
        </span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Tìm kiếm"
        description="Tìm sản phẩm, bài cẩm nang và các trang trên Dev Pồ"
        commandProps={{ shouldFilter: false }}
        className="top-[15%] translate-y-0"
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Tìm iPhone, iPad, cẩm nang, mã IMSI…"
        />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>
            Không tìm thấy kết quả cho{" "}
            <span className="font-medium text-foreground">
              &ldquo;{query}&rdquo;
            </span>
            .
          </CommandEmpty>

          {results.map((group) => {
            const meta = TYPE_META[group.type];
            return (
              <CommandGroup
                key={group.type}
                heading={query.trim() ? meta.label : `Gợi ý · ${meta.label}`}
              >
                {group.items.map((doc) => {
                  const Icon = meta.icon;
                  return (
                    <CommandItem
                      key={doc.id}
                      value={doc.id}
                      onSelect={() => handleSelect(doc.href)}
                      className="group cursor-pointer gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-foreground">
                          {doc.title}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {doc.subtitle}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-data-[selected=true]:opacity-100" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

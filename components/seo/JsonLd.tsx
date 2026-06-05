// Component tái sử dụng để render JSON-LD Structured Data.
// Truyền vào 1 object schema.org (hoặc mảng object) -> render <script type="application/ld+json">.
// Dùng được trong Server Component (không cần "use client").

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify đủ an toàn cho dữ liệu nội bộ; thay </ để tránh đóng thẻ script sớm.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

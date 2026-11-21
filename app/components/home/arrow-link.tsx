import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

/** Link chữ có mũi tên, gạch chân chạy ra khi rê chuột. */
export function ArrowLink({ href, children, external, className }: ArrowLinkProps) {
  const classes = cn(
    "group inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-semibold text-foreground",
    className,
  );
  const inner = (
    <>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

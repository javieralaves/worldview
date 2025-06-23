"use client";
import { usePathname } from "next/navigation";
import { TopNav } from "./top-nav";

export function TopNavConditional() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <TopNav />;
}

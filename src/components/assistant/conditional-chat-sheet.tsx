"use client";
import { usePathname } from "next/navigation";
import { ChatSheet } from "./chat-sheet";

export function ConditionalChatSheet() {
  const pathname = usePathname();
  if (pathname.includes("/nyc")) return null;
  return <ChatSheet />;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./chat-panel";

export function ChatSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();
  const [chatKey, setChatKey] = useState(0);

  const handleOpenChat = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.prompt) {
      setInitialPrompt(detail.prompt);
      setChatKey((k) => k + 1);
    }
    setIsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("lami:open-chat", handleOpenChat);
    return () => window.removeEventListener("lami:open-chat", handleOpenChat);
  }, [handleOpenChat]);

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ocean text-white shadow-lg transition-all hover:bg-ocean/90 hover:shadow-xl"
          aria-label="Open concierge"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg transform border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean/10">
                <MessageCircle className="h-4 w-4 text-ocean" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-wide text-foreground">
                  L&apos;Ami Mauricien
                </p>
                <p className="text-[10px] tracking-wide text-muted-foreground">
                  AI Concierge
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-cream hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat content */}
          <ChatPanel
            key={chatKey}
            initialPrompt={initialPrompt}
            showPersonas={true}
          />
        </div>
      </div>
    </>
  );
}

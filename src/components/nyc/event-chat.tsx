"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ArrowUp, X } from "lucide-react";
import type { TechWeekEvent } from "@/lib/data/events";

const SUGGESTED_PROMPTS = [
  "Which events are harder to get into than YC?",
  "Free food actually worth showing up for?",
  "Where can I get an Angel check?",
];

function buildEventContext(events: TechWeekEvent[]): string {
  const lines = events
    .filter((e) => e.partiful)
    .sort((a, b) => (b.partiful?.guestCount ?? 0) - (a.partiful?.guestCount ?? 0))
    .slice(0, 200)
    .map((e) => {
      const p = e.partiful!;
      const total = p.approvedCount + p.pendingCount;
      const approvalRate =
        p.guestAction === "APPLY" && total > 0
          ? Math.round((p.approvedCount / total) * 100)
          : null;
      return [
        e.name,
        `by ${e.company}`,
        e.date,
        e.time,
        e.location,
        `${p.guestCount} guests`,
        p.atCapacity ? "FULL" : "open",
        approvalRate !== null ? `${approvalRate}% approval` : "",
        p.guestAction === "APPLY" ? "application-based" : "direct RSVP",
        e.topics.join("/"),
        e.isInviteOnly ? "invite-only" : "",
        e.url ? e.url : "",
      ]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");

  return `Here are the top 200 NYC Tech Week events with live Partiful data:\n${lines}`;
}

function getMessageText(msg: { parts: Array<{ type: string; text?: string }> }): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function formatResponse(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0A8F5A] underline underline-offset-2 hover:opacity-80 transition-opacity">$1</a>'
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

export function EventChat({ events }: { events: TechWeekEvent[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const eventContext = useMemo(() => buildEventContext(events), [events]);

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/nyc-chat",
        body: { eventContext },
      }),
    [eventContext]
  );

  const { messages, sendMessage, status } = useChat({ transport });
  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    for (const ref of [scrollRef, desktopScrollRef]) {
      if (ref.current) {
        // Instant scroll, not "smooth" — on mobile, firing a smooth-scroll
        // animation on every token-stream tick thrashes the GPU and makes
        // the streamed text appear to lag/stutter.
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      // Hide the main site's floating chat bubble
      const fab = document.querySelector('[aria-label="Open concierge"]') as HTMLElement | null;
      if (fab) fab.style.display = "none";
      setTimeout(() => inputRef.current?.focus(), 100);
      return () => {
        if (fab) fab.style.display = "";
      };
    }
  }, [isExpanded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!isExpanded) setIsExpanded(true);
    sendMessage({ text: input.trim() });
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }

  function handlePromptClick(prompt: string) {
    if (!isExpanded) setIsExpanded(true);
    sendMessage({ text: prompt });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  }

  // Collapsed state — unified card with embedded input
  if (!isExpanded) {
    return (
      <div className="mb-6 rounded-[18px] border-[1.5px] border-[#00FF9C]/55 [background:color-mix(in_srgb,#00FF9C_9%,#F7F2E7)] shadow-[0_4px_24px_-8px_rgba(0,255,156,0.22)] transition-all duration-[160ms] hover:border-[#00FF9C]">
        {/* Header row */}
        <div className="flex items-center gap-4 p-4 pb-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-[#00FF9C] text-[22px] text-[#0C0C0A]">
            ✦
          </div>
          <div className="min-w-0 flex-1">
            <h2
              className="font-extrabold tracking-[-0.025em] text-[#1C1A14]"
              style={{ fontSize: "clamp(18px,2.4vw,23px)" }}
            >
              Ask me anything
            </h2>
            <p className="text-[13px] text-[#766E5C]">NYC Tech Week · live data</p>
          </div>
        </div>

        {/* Prompt chips */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              className="shrink-0 rounded-full border border-[#00FF9C]/50 bg-[#00FF9C]/15 px-3 py-1.5 text-[13px] font-medium text-[#0A8F5A] transition-colors hover:bg-[#00FF9C]/25 hover:border-[#00FF9C]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input — sits inside the card, separated by a hairline */}
        <div className="border-t border-[#00FF9C]/25 px-3 pb-3 pt-2.5">
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 rounded-[12px] border border-[#CDC1A6] bg-[#F7F2E7] px-4 py-2.5 transition-colors focus-within:border-[#00FF9C]"
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events, vibes, availability…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-[16px] leading-snug text-[#1C1A14] placeholder:text-[#A79E89] outline-none"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1C1A14] text-[#E9E2D3] transition-all disabled:opacity-20"
            >
              <ArrowUp className="size-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const hasMessages = messages.length > 0 || isLoading;

  // Expanded state — full-screen overlay on mobile, large inline on desktop
  return (
    <>
      {/* Mobile: full-screen overlay */}
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F7F2E7] lg:hidden">
        {/* Drag handle / tap-to-close hint */}
        <div
          className="flex shrink-0 justify-center pt-3 pb-1 cursor-pointer"
          onClick={() => setIsExpanded(false)}
        >
          <div className="h-1 w-10 rounded-full bg-[#DDD3BD]" />
        </div>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-1">
          <h2 className="text-xl font-bold tracking-tight text-[#1C1A14]">
            Ask me anything
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="flex size-8 items-center justify-center rounded-full bg-[#F0E8D9] text-[#766E5C] transition-colors active:bg-[#DDD3BD]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          {!hasMessages && (
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="flex flex-col gap-2 w-full max-w-sm">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="rounded-[14px] border border-[#00FF9C]/50 bg-[#00FF9C]/15 px-4 py-3 text-left text-[14px] font-medium text-[#0A8F5A] transition-colors active:bg-[#00FF9C]/25"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="px-5 py-4 space-y-6">
              {messages
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((msg) => {
                  const text = getMessageText(msg);
                  if (msg.role === "user" && !text) return null;
                  return (
                    <div key={msg.id}>
                      {msg.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-[16px] rounded-br-[4px] bg-[#1C1A14] px-4 py-3 text-[15px] leading-relaxed text-[#E9E2D3]">
                            {text}
                          </div>
                        </div>
                      ) : text ? (
                        <div className="text-[15px] leading-[1.7] text-[#1C1A14] [&_strong]:font-semibold [&_strong]:text-[#1C1A14]">
                          <div dangerouslySetInnerHTML={{ __html: formatResponse(text) }} />
                        </div>
                      ) : (
                        <TypingIndicator />
                      )}
                    </div>
                  );
                })}

              {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
                <TypingIndicator />
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-[#DDD3BD] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 rounded-[14px] border border-[#CDC1A6] bg-[#F0E8D9] px-4 py-2.5 transition-colors focus-within:border-[#00FF9C]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-[16px] leading-snug text-[#1C1A14] placeholder:text-[#A79E89] outline-none"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1C1A14] text-[#E9E2D3] transition-all disabled:opacity-20"
            >
              <ArrowUp className="size-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop: backdrop to tap-outside-to-close */}
      <div className="fixed inset-0 z-40 hidden lg:block" onClick={() => setIsExpanded(false)} />

      {/* Desktop: large inline card */}
      <div className="mb-6 hidden lg:flex flex-col overflow-hidden rounded-[18px] border border-[#CDC1A6] bg-[#F7F2E7] relative z-50" style={{ height: "min(62vh, 520px)" }}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#DDD3BD] px-6 py-3.5">
          <h2 className="text-lg font-bold tracking-tight text-[#1C1A14]">
            Ask me anything
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="flex size-8 items-center justify-center rounded-full bg-[#F0E8D9] text-[#766E5C] transition-colors hover:bg-[#DDD3BD]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto desktop-scroll" ref={desktopScrollRef}>
          {!hasMessages && (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12">
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="rounded-full border border-[#00FF9C]/50 bg-[#00FF9C]/15 px-3.5 py-2 text-sm font-medium text-[#0A8F5A] transition-colors hover:bg-[#00FF9C]/25 hover:border-[#00FF9C]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="px-6 py-5 space-y-6">
              {messages
                .filter((m) => m.role === "user" || m.role === "assistant")
                .map((msg) => {
                  const text = getMessageText(msg);
                  if (msg.role === "user" && !text) return null;
                  return (
                    <div key={msg.id}>
                      {msg.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[75%] rounded-[16px] rounded-br-[4px] bg-[#1C1A14] px-4 py-3 text-[14px] leading-relaxed text-[#E9E2D3]">
                            {text}
                          </div>
                        </div>
                      ) : text ? (
                        <div className="max-w-[90%] text-[14px] leading-[1.7] text-[#1C1A14] [&_strong]:font-semibold [&_strong]:text-[#1C1A14]">
                          <div dangerouslySetInnerHTML={{ __html: formatResponse(text) }} />
                        </div>
                      ) : (
                        <TypingIndicator />
                      )}
                    </div>
                  );
                })}

              {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
                <TypingIndicator />
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-[#DDD3BD] px-5 py-3">
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 rounded-[14px] border border-[#CDC1A6] bg-[#F0E8D9] px-4 py-2.5 transition-colors focus-within:border-[#00FF9C]"
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about events, vibes, availability..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm leading-snug text-[#1C1A14] placeholder:text-[#A79E89] outline-none"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1C1A14] text-[#E9E2D3] transition-all disabled:opacity-20"
            >
              <ArrowUp className="size-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span className="size-[6px] animate-bounce rounded-full bg-[#A79E89]" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
      <span className="size-[6px] animate-bounce rounded-full bg-[#A79E89]" style={{ animationDelay: "150ms", animationDuration: "1s" }} />
      <span className="size-[6px] animate-bounce rounded-full bg-[#A79E89]" style={{ animationDelay: "300ms", animationDuration: "1s" }} />
    </div>
  );
}

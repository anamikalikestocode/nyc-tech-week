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
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900 transition-colors">$1</a>'
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
        ref.current.scrollTo({
          top: ref.current.scrollHeight,
          behavior: "smooth",
        });
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

  useEffect(() => {
    if (status === "streaming") {
      const interval = setInterval(scrollToBottom, 80);
      return () => clearInterval(interval);
    }
  }, [status, scrollToBottom]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
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

  // Collapsed state — inline card
  if (!isExpanded) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-5 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              <span className="mr-2 text-3xl sm:text-4xl">💬</span>
              Ask me anything
            </h2>
          </div>
        </button>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const hasMessages = messages.length > 0 || isLoading;

  // Expanded state — full-screen overlay on mobile, large inline on desktop
  return (
    <>
      {/* Mobile: full-screen overlay */}
      <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
        {/* Drag handle / tap-to-close hint */}
        <div
          className="flex shrink-0 justify-center pt-3 pb-1 cursor-pointer"
          onClick={() => setIsExpanded(false)}
        >
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Ask me anything
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors active:bg-gray-200"
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
                    className="rounded-2xl border border-gray-200 px-4 py-3 text-left text-[14px] text-gray-600 transition-colors active:bg-gray-50"
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
                          <div className="max-w-[85%] rounded-[20px] rounded-br-md bg-gray-900 px-4 py-3 text-[15px] leading-relaxed text-white">
                            {text}
                          </div>
                        </div>
                      ) : text ? (
                        <div className="text-[15px] leading-[1.7] text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900">
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
        <div className="shrink-0 border-t border-gray-100 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 rounded-[22px] border border-gray-200 bg-gray-50/80 px-4 py-2.5 transition-colors focus-within:border-gray-300 focus-within:bg-white"
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
              className="flex-1 resize-none bg-transparent text-[16px] leading-snug text-gray-900 placeholder:text-gray-400 outline-none"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-all disabled:opacity-20"
            >
              <ArrowUp className="size-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop: backdrop to tap-outside-to-close */}
      <div className="fixed inset-0 z-40 hidden lg:block" onClick={() => setIsExpanded(false)} />

      {/* Desktop: large inline card */}
      <div className="mb-6 hidden lg:flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm relative z-50" style={{ height: "min(70vh, 600px)" }}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3.5">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            Ask me anything
          </h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
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
                    className="rounded-full border border-gray-200 px-3.5 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
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
                          <div className="max-w-[75%] rounded-[20px] rounded-br-md bg-gray-900 px-4 py-3 text-[14px] leading-relaxed text-white">
                            {text}
                          </div>
                        </div>
                      ) : text ? (
                        <div className="max-w-[90%] text-[14px] leading-[1.7] text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900">
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
        <div className="shrink-0 border-t border-gray-100 px-5 py-3">
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 rounded-[22px] border border-gray-200 bg-gray-50/80 px-4 py-2.5 transition-colors focus-within:border-gray-300 focus-within:bg-white"
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
              className="flex-1 resize-none bg-transparent text-sm leading-snug text-gray-900 placeholder:text-gray-400 outline-none"
              style={{ maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-all disabled:opacity-20"
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
      <span className="size-[6px] animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
      <span className="size-[6px] animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms", animationDuration: "1s" }} />
      <span className="size-[6px] animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms", animationDuration: "1s" }} />
    </div>
  );
}

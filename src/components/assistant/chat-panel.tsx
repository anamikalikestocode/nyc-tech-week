"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useEffect, useState, useMemo } from "react";
import { ArrowRight, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { PERSONAS } from "@/lib/constants";
import ReactMarkdown from "react-markdown";

interface ChatPanelProps {
  initialPrompt?: string;
  showPersonas?: boolean;
}

export function ChatPanel({
  initialPrompt,
  showPersonas = true,
}: ChatPanelProps) {
  const locale = useLocale();
  const t = useTranslations("assistant");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(!!initialPrompt);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/chat",
        body: { locale },
      }),
    [locale]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-send initial prompt
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      sendMessage({ text: initialPrompt });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handlePersonaClick(prompt: string) {
    setHasStarted(true);
    sendMessage({ text: prompt });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setHasStarted(true);
    sendMessage({ text: input.trim() });
    setInput("");
  }

  // Extract text content from message parts
  function getMessageText(
    msg: (typeof messages)[number]
  ): string {
    return (
      msg.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("") ?? ""
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
        {!hasStarted && messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Sparkles className="mb-4 h-8 w-8 text-ocean/30" />
            <h3 className="mb-2 font-heading text-xl tracking-wide text-foreground">
              {t("title")}
            </h3>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              {t("subtitle")}
            </p>

            {showPersonas && (
              <div className="grid w-full max-w-md grid-cols-2 gap-3">
                {PERSONAS.map((persona) => {
                  const label =
                    locale === "fr" ? persona.labelFr : persona.labelEn;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaClick(persona.prompt)}
                      className="rounded-lg border border-border bg-cream/50 px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-ocean/30 hover:bg-ocean/5 hover:text-foreground"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => {
                const text = getMessageText(m);
                if (!text) return null;
                return (
                  <ChatMessage
                    key={m.id}
                    role={m.role as "user" | "assistant"}
                    content={text}
                  />
                );
              })}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-ocean/50" />
                {t("thinking")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border px-6 py-4">
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl">
          <div className="group relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
                }
              }}
              placeholder={t("placeholder")}
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-cream/50 px-5 py-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-ocean/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-ocean/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-ocean p-1.5 text-white transition-all hover:bg-ocean/80 disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const [feedback, setFeedback] = useState<1 | -1 | null>(null);

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-ocean/10 px-5 py-3">
          <p className="text-sm leading-relaxed text-foreground">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-ocean/50" />
        <span className="text-[10px] tracking-luxury text-ocean/50 uppercase">
          L&apos;Ami Mauricien
        </span>
      </div>
      <div className="prose prose-sm max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-ocean prose-li:text-muted-foreground prose-headings:font-heading prose-headings:tracking-wide prose-headings:text-foreground">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {/* Feedback buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setFeedback(1)}
          className={`p-1 transition-colors ${
            feedback === 1
              ? "text-ocean"
              : "text-muted-foreground/30 hover:text-muted-foreground"
          }`}
        >
          <ThumbsUp className="h-3 w-3" />
        </button>
        <button
          onClick={() => setFeedback(-1)}
          className={`p-1 transition-colors ${
            feedback === -1
              ? "text-red-400"
              : "text-muted-foreground/30 hover:text-muted-foreground"
          }`}
        >
          <ThumbsDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

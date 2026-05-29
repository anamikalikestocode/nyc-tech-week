"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const t = useTranslations("hero");
  const [prompt, setPrompt] = useState("");

  function handleSubmit() {
    if (!prompt.trim()) return;
    window.dispatchEvent(
      new CustomEvent("lami:open-chat", { detail: { prompt: prompt.trim() } })
    );
    setPrompt("");
  }

  return (
    <section
      id="hero-prompt"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Full-screen video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80"
        >
          <source
            src="https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 text-xs tracking-luxury text-white/70 uppercase md:text-sm">
          L&apos;Ami Mauricien
        </p>

        <h1 className="mb-6 font-heading text-5xl leading-tight tracking-wide text-white md:text-7xl">
          {t("headline")}
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg text-white/60 md:text-xl">
          {t("subheadline")}
        </p>

        {/* AI prompt input — frosted glass */}
        <div className="mx-auto max-w-2xl">
          <div className="group relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={t("placeholder")}
              rows={2}
              className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-6 py-5 pr-14 text-base text-white placeholder:text-white/40 backdrop-blur-xl transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-ocean p-2 text-white transition-all hover:bg-ocean/80"
              aria-label="Submit prompt"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 animate-bounce">
          <div className="mx-auto h-8 w-[1px] bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </div>
    </section>
  );
}

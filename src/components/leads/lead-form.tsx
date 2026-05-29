"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface LeadFormProps {
  partnerSlug: string;
  partnerName: string;
}

export function LeadForm({ partnerSlug, partnerName }: LeadFormProps) {
  const t = useTranslations("lead");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      partnerSlug,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dates: formData.get("dates") as string,
      groupSize: parseInt(formData.get("groupSize") as string) || 1,
      message: formData.get("message") as string,
    };

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // Handle error silently for now
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-ocean/20 bg-ocean/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ocean/10">
          <Check className="h-6 w-6 text-ocean" />
        </div>
        <p className="text-sm text-muted-foreground">{t("success")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-white p-8 shadow-sm space-y-5"
    >
      <div>
        <h3 className="mb-1 font-heading text-xl tracking-wide text-foreground">
          {t("title")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-1 text-xs text-ocean/60">{partnerName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
            {t("name")}
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
            {t("email")}
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
            {t("phone")}
          </label>
          <input
            name="phone"
            className="w-full rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
            {t("dates")}
          </label>
          <input
            name="dates"
            type="text"
            placeholder="e.g. June 15-22"
            className="w-full rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
            {t("groupSize")}
          </label>
          <input
            name="groupSize"
            type="number"
            min="1"
            defaultValue="2"
            className="w-full rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs tracking-wide text-foreground/40 uppercase">
          {t("message")}
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder={t("messagePlaceholder")}
          className="w-full resize-none rounded-lg border border-border bg-cream/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-ocean/40 focus:outline-none focus:ring-1 focus:ring-ocean/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-ocean px-6 py-4 text-xs tracking-luxury text-white transition-all hover:bg-ocean/90 disabled:opacity-50"
      >
        <span>{t("submit")}</span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}

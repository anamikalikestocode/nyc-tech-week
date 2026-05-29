"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Mail, Check } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // TODO: Wire to Supabase auth.signInWithOtp({ email })
    // For now, simulate the magic link flow
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs tracking-wide text-white/50 transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-3 w-3" />
        {t("backToHome")}
      </Link>

      <div className="border border-white/5 bg-white/[0.02] p-10">
        <h1 className="mb-2 font-heading text-2xl tracking-wide text-white">
          {t("loginTitle")}
        </h1>
        <p className="mb-8 text-sm text-white/50">{t("loginSubtitle")}</p>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-gold/30 bg-gold/10">
              <Check className="h-6 w-6 text-gold" />
            </div>
            <p className="text-sm text-white/70">{t("checkEmail")}</p>
            <p className="mt-2 text-xs text-white/40">{email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs tracking-wide text-white/40 uppercase">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="w-full border border-white/10 bg-white/[0.03] py-4 pr-4 pl-11 text-sm text-white placeholder:text-white/25 transition-all focus:border-gold/30 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="group flex w-full items-center justify-center gap-2 border border-gold bg-gold/10 px-6 py-4 text-xs tracking-luxury text-gold transition-all hover:bg-gold/20 disabled:opacity-50"
            >
              <span>{t("sendMagicLink")}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Sparkles className="h-5 w-5 text-ocean" />
              <span className="font-heading text-lg tracking-luxury text-charcoal">
                L&apos;AMI MAURICIEN
              </span>
            </div>
            <p className="font-heading text-lg italic text-ocean/70">
              {t("tagline")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-luxury text-foreground/40 uppercase">
              {t("quickLinks")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/explore"
                className="text-sm text-muted-foreground transition-colors hover:text-ocean"
              >
                Explore Mauritius
              </Link>
              <Link
                href="/explore"
                className="text-sm text-muted-foreground transition-colors hover:text-ocean"
              >
                Regions
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-ocean"
              >
                About Mauritius
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-luxury text-foreground/40 uppercase">
              {t("legal")}
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-ocean"
              >
                {t("privacy")}
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-ocean"
              >
                {t("terms")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground/60">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

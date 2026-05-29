"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we're on a page with a dark hero (homepage, partner detail, region pages)
  const isHeroPage = pathname === "/" || pathname.startsWith("/partners/") || pathname.startsWith("/explore/regions/") || pathname.startsWith("/explore/experiences/") || pathname.startsWith("/explore/collections/");

  const navLinks = [
    { href: "/explore", label: t("explore") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled || !isHeroPage
          ? "border-b border-border/50 bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Sparkles
            className={cn(
              "h-5 w-5 transition-colors",
              scrolled || !isHeroPage ? "text-ocean" : "text-white"
            )}
          />
          <span
            className={cn(
              "font-heading text-lg tracking-luxury transition-colors",
              scrolled || !isHeroPage ? "text-charcoal" : "text-white"
            )}
          >
            L&apos;AMI MAURICIEN
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors",
                scrolled || !isHeroPage
                  ? pathname === link.href
                    ? "text-ocean"
                    : "text-charcoal/70 hover:text-ocean"
                  : pathname === link.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={pathname}
            locale={t("switchLang") === "FR" ? "fr" : "en"}
            className={cn(
              "text-sm tracking-wide transition-colors",
              scrolled || !isHeroPage
                ? "text-charcoal/40 hover:text-ocean"
                : "text-white/50 hover:text-white"
            )}
          >
            {t("switchLang")}
          </Link>
          <Link
            href="/auth/login"
            className={cn(
              "hidden rounded-full px-5 py-2 text-xs tracking-luxury transition-all md:block",
              scrolled || !isHeroPage
                ? "border border-ocean/30 text-ocean hover:border-ocean hover:bg-ocean/5"
                : "border border-white/30 text-white hover:border-white/60 hover:bg-white/10"
            )}
          >
            {t("login")}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden",
              scrolled || !isHeroPage ? "text-charcoal" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-white/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 text-sm tracking-wide transition-colors",
                  pathname === link.href
                    ? "text-ocean"
                    : "text-charcoal/70 hover:text-charcoal"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 border-t border-border/50 pt-4 text-sm tracking-wide text-ocean"
            >
              {t("login")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays, Plus } from "lucide-react";

export default async function TripsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-background px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <TripsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}

function TripsContent() {
  const t = useTranslations("itinerary");

  // TODO: Fetch user's itineraries from Supabase
  // For now, show empty state
  return (
    <div className="text-center">
      <CalendarDays className="mx-auto mb-4 h-12 w-12 text-white/20" />
      <h1 className="mb-2 font-heading text-3xl tracking-wide text-white">
        {t("title")}
      </h1>
      <p className="mb-8 text-white/50">
        {t("loginToSave")}
      </p>
      <Link
        href="/auth/login"
        className="group inline-flex items-center gap-2 border border-gold bg-gold/10 px-8 py-4 text-xs tracking-luxury text-gold transition-all hover:bg-gold/20"
      >
        <Plus className="h-3 w-3" />
        <span>Start Planning</span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

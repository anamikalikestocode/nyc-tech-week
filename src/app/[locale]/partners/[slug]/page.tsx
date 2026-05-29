import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPartnerBySlug, getAllPartners } from "@/lib/data/partners";
import { PartnerDetail } from "./partner-detail";

export function generateStaticParams() {
  return getAllPartners().map((p) => ({ slug: p.slug }));
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();

  return (
    <>
      <Header />
      <main>
        <PartnerDetail partner={partner} locale={locale} />
      </main>
      <Footer />
    </>
  );
}

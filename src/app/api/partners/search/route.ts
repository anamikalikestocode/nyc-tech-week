import { NextRequest, NextResponse } from "next/server";
import { searchPartners } from "@/lib/data/partners";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const results = searchPartners({
    region: searchParams.get("region") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    tags: searchParams.get("tags")?.split(",").filter(Boolean) ?? undefined,
    priceRange: searchParams.get("price")?.split(",").filter(Boolean) ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return NextResponse.json({
    count: results.length,
    partners: results.map((p) => ({
      slug: p.slug,
      name: p.name,
      shortDescEn: p.short_desc_en,
      shortDescFr: p.short_desc_fr,
      priceRange: p.price_range,
      region: p.region?.slug,
      regionName: p.region?.name_en,
      category: p.category?.slug,
      categoryName: p.category?.name_en,
      heroImage: p.hero_image,
      tags: p.tags?.map((t) => t.slug),
      qualityScore: p.quality_score,
    })),
  });
}

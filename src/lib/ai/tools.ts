import { z } from "zod";
import { tool } from "ai";
import {
  searchPartners,
  getPartnerBySlug,
  getRegionBySlug,
  getAllRegions,
  getCollectionBySlug,
  getAllCollections,
} from "@/lib/data/partners";

const searchPartnersTool = tool({
  description:
    "Search the curated partner database. Use this to find restaurants, experiences, cultural activities, and premium transport. You can filter by region, category, tags, price range, and free-text query. Always use this before making any recommendation.",
  inputSchema: z.object({
    region: z
      .enum(["north", "east", "south", "west"])
      .optional()
      .describe("Filter by region slug"),
    category: z
      .enum([
        "restaurants",
        "experiences-tours",
        "culture-events",
        "premium-transport",
      ])
      .optional()
      .describe("Filter by category slug"),
    tags: z
      .array(
        z.enum([
          "honeymoon", "family-friendly", "adventure", "luxury", "fine-dining",
          "romantic", "water-sports", "nature", "cultural", "sunset", "beach",
          "local-cuisine", "photography", "private", "half-day", "full-day",
          "evening", "group-friendly",
        ])
      )
      .optional()
      .describe("Filter by tag slugs (matches any)"),
    priceRange: z
      .array(z.enum(["$", "$$", "$$$", "$$$$"]))
      .optional()
      .describe("Filter by price range(s)"),
    q: z.string().optional().describe("Free-text search"),
  }),
  execute: async ({ region, category, tags, priceRange, q }) => {
    const results = searchPartners({ region, category, tags, priceRange, q });
    return {
      count: results.length,
      partners: results.map((p) => ({
        slug: p.slug,
        name: p.name,
        shortDescEn: p.short_desc_en,
        shortDescFr: p.short_desc_fr,
        priceRange: p.price_range,
        region: p.region?.name_en,
        regionSlug: p.region?.slug,
        category: p.category?.name_en,
        categorySlug: p.category?.slug,
        qualityScore: p.quality_score,
        tags: p.tags?.map((t) => t.name_en),
        signatureOffers: p.signature_offers,
      })),
    };
  },
});

const getPartnerDetailsTool = tool({
  description:
    "Get full details about a specific partner by slug. Use this for detailed recommendations.",
  inputSchema: z.object({
    slug: z.string().describe("The partner's URL slug"),
  }),
  execute: async ({ slug }) => {
    const p = getPartnerBySlug(slug);
    if (!p) return { error: "Partner not found" };
    return {
      slug: p.slug,
      name: p.name,
      descriptionEn: p.description_en,
      descriptionFr: p.description_fr,
      shortDescEn: p.short_desc_en,
      shortDescFr: p.short_desc_fr,
      priceRange: p.price_range,
      region: p.region?.name_en,
      regionSlug: p.region?.slug,
      category: p.category?.name_en,
      address: p.address,
      phone: p.phone,
      website: p.website,
      signatureOffers: p.signature_offers,
      tags: p.tags?.map((t) => ({ slug: t.slug, nameEn: t.name_en, nameFr: t.name_fr })),
      qualityScore: p.quality_score,
      profileUrl: `/partners/${p.slug}`,
    };
  },
});

const getRegionInfoTool = tool({
  description:
    "Get information about a region of Mauritius (North, East, South, or West).",
  inputSchema: z.object({
    slug: z.enum(["north", "east", "south", "west"]).describe("Region slug"),
  }),
  execute: async ({ slug }) => {
    const region = getRegionBySlug(slug);
    if (!region) return { error: "Region not found" };
    return {
      slug: region.slug,
      nameEn: region.name_en,
      nameFr: region.name_fr,
      descriptionEn: region.description_en,
      descriptionFr: region.description_fr,
      exploreUrl: `/explore/regions/${region.slug}`,
    };
  },
});

const listRegionsTool = tool({
  description: "List all four regions of Mauritius with their descriptions.",
  inputSchema: z.object({}),
  execute: async () => {
    return getAllRegions().map((r) => ({
      slug: r.slug,
      nameEn: r.name_en,
      nameFr: r.name_fr,
      descriptionEn: r.description_en,
      descriptionFr: r.description_fr,
    }));
  },
});

const getCollectionTool = tool({
  description:
    "Get a curated editorial collection by slug. Collections are themed groupings.",
  inputSchema: z.object({
    slug: z.string().describe("Collection slug"),
  }),
  execute: async ({ slug }) => {
    const data = getCollectionBySlug(slug);
    if (!data) return { error: "Collection not found" };
    return {
      titleEn: data.collection.title_en,
      titleFr: data.collection.title_fr,
      subtitleEn: data.collection.subtitle_en,
      subtitleFr: data.collection.subtitle_fr,
      descriptionEn: data.collection.description_en,
      descriptionFr: data.collection.description_fr,
      partners: data.partners.map((p) => ({
        slug: p.slug,
        name: p.name,
        shortDescEn: p.short_desc_en,
        priceRange: p.price_range,
        region: p.region?.name_en,
      })),
      exploreUrl: `/explore/collections/${slug}`,
    };
  },
});

const listCollectionsTool = tool({
  description: "List all available editorial collections.",
  inputSchema: z.object({}),
  execute: async () => {
    return getAllCollections().map((c) => ({
      slug: c.slug,
      titleEn: c.title_en,
      titleFr: c.title_fr,
      subtitleEn: c.subtitle_en,
      subtitleFr: c.subtitle_fr,
    }));
  },
});

const composeItineraryTool = tool({
  description:
    "Compose a structured multi-day itinerary from partner slugs. Use after searching for partners to build a cohesive trip plan.",
  inputSchema: z.object({
    title: z.string().describe("Itinerary title"),
    days: z.array(
      z.object({
        dayNumber: z.number(),
        title: z.string().describe("Theme for the day"),
        slots: z.array(
          z.object({
            timeSlot: z.enum(["morning", "afternoon", "evening"]),
            partnerSlug: z.string().describe("Partner slug to include"),
            note: z.string().optional().describe("Additional context"),
          })
        ),
      })
    ).describe("Array of days with time slots"),
  }),
  execute: async ({ title, days }) => {
    const itinerary = days.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      slots: day.slots.map((slot) => {
        const partner = getPartnerBySlug(slot.partnerSlug);
        return {
          timeSlot: slot.timeSlot,
          partner: partner
            ? {
                slug: partner.slug,
                name: partner.name,
                shortDescEn: partner.short_desc_en,
                priceRange: partner.price_range,
                region: partner.region?.name_en,
                address: partner.address,
                profileUrl: `/partners/${partner.slug}`,
              }
            : null,
          note: slot.note,
        };
      }),
    }));
    return { title, days: itinerary };
  },
});

export const aiTools = {
  search_partners: searchPartnersTool,
  get_partner_details: getPartnerDetailsTool,
  get_region_info: getRegionInfoTool,
  list_regions: listRegionsTool,
  get_collection: getCollectionTool,
  list_collections: listCollectionsTool,
  compose_itinerary: composeItineraryTool,
};

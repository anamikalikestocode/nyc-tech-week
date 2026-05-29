import {
  type PartifulData,
  scrapeAllPartifulData,
} from "./partiful";

const TECH_WEEK_API =
  "https://www.tech-week.com/calendar/api/trpc/calendar.events?batch=1";

const PER_PAGE = 48;

export type { PartifulData };

export interface TechWeekEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  company: string;
  url: string;
  isInviteOnly: boolean;
  topics: string[];
  formats: string[];
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Noon";
  partiful?: PartifulData;
}

const TOPIC_RULES: Record<string, string[]> = {
  "AI/ML": [
    "ai ",
    " ai",
    "artificial intelligence",
    "machine learning",
    " ml ",
    "llm",
    "gpt",
    "genai",
    "generative",
    "deep learning",
    "neural",
    "chatbot",
    "agentic",
    "agent ",
    " agents",
    "openai",
    "anthropic",
    "claude",
    "automation",
    "computer vision",
    "nlp",
    "model",
  ],
  "VC/Investing": [
    "vc ",
    "venture",
    "investor",
    "investing",
    "fundrais",
    "capital",
    "pitch",
    "angel",
    "allocator",
    "fund ",
    "lp ",
    "gp ",
    "seed ",
    "series a",
    "series b",
    "portfolio",
    "family office",
  ],
  "Founder/Startup": [
    "founder",
    "startup",
    "entrepreneur",
    "building",
    "launch",
    "early-stage",
    "bootstrapp",
    "co-founder",
    "yc ",
    "techstars",
    "accelerator",
  ],
  "Social/Party": [
    "party",
    "happy hour",
    "mixer",
    "cocktail",
    "drinks",
    "rooftop",
    "brunch",
    "dinner",
    "social",
    "celebration",
    "afterparty",
    "soiree",
  ],
  "Dev/Engineering": [
    "developer",
    "engineering",
    "code",
    "hack",
    "devops",
    "infra",
    "open source",
    "api ",
    "backend",
    "frontend",
    "full stack",
    "software",
  ],
  Healthcare: [
    "health",
    "biotech",
    "medtech",
    "pharma",
    "wellness",
    "clinical",
    "patient",
    "medical",
    "care delivery",
  ],
  Fintech: [
    "fintech",
    "finance",
    "banking",
    "payments",
    "financial",
    "insurance",
    "insurtech",
    "lending",
  ],
  "Design/Creative": [
    "design",
    "creative",
    "art ",
    " art",
    "music",
    "fashion",
    "brand",
    "ux ",
    "ui ",
  ],
  "Women/Diversity": [
    "women",
    "female",
    "diversity",
    "dei",
    "inclusion",
    "latinx",
    "black ",
    "lgbtq",
    "queer",
    "underrepresented",
  ],
  "Media/Content": [
    "media",
    "content",
    "creator",
    "podcast",
    "journalism",
    "newsletter",
    "publishing",
  ],
  "Sports/Fitness": [
    "run ",
    "running",
    "workout",
    "fitness",
    "basketball",
    "tennis",
    "pickleball",
    "golf",
    "yoga",
    "pilates",
    "hike",
    "walk ",
  ],
  "Climate/Energy": [
    "climate",
    "cleantech",
    "energy",
    "sustainability",
    "green",
    "carbon",
    "solar",
  ],
  "Product/Growth": [
    "product",
    "growth",
    "marketing",
    "gtm",
    "go-to-market",
    "acquisition",
    "retention",
    "seo",
    "plg",
  ],
  "Real Estate": [
    "real estate",
    "proptech",
    "housing",
    "construction",
    "commercial real",
  ],
  "Crypto/Web3": [
    "crypto",
    "web3",
    "blockchain",
    "defi",
    "bitcoin",
    "ethereum",
    "token",
    "nft",
    "solana",
    "decentralized",
  ],
  Legal: ["legal", "law ", "compliance", "regulation", "policy"],
  Consumer: [
    "consumer",
    "b2c",
    "e-commerce",
    "ecommerce",
    "retail",
    "cpg",
    "d2c",
    "dtc",
    "marketplace",
  ],
  SaaS: ["saas", "b2b", "enterprise", "sales ", "crm"],
};

const FORMAT_RULES: Record<string, string[]> = {
  "Panel/Talk": [
    "panel",
    "talk",
    "fireside",
    "keynote",
    "speaker",
    "discussion",
    "conversation",
    "forum",
  ],
  Workshop: ["workshop", "bootcamp", "masterclass", "hands-on", "hands on"],
  Hackathon: ["hackathon", "hack "],
  "Demo Day": ["demo day", "demo night", "showcase", "exhibition"],
  Conference: ["conference", "summit", "symposium"],
  "Networking/Mixer": [
    "mixer",
    "networking",
    "meet and greet",
    "mingle",
    "connect",
    "meetup",
  ],
  "Dinner/Drinks": [
    "dinner",
    "happy hour",
    "cocktail",
    "drinks",
    "brunch",
    "lunch",
    "reception",
    "supper",
  ],
  Party: ["party", "bash", "afterparty", "soiree", "celebration", "gala"],
  Fitness: [
    "run ",
    "running",
    "workout",
    "yoga",
    "pilates",
    "tennis",
    "pickleball",
    "basketball",
    "hike",
    "walk",
  ],
};

function matchKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

function classifyEvent(
  name: string,
  company: string
): { topics: string[]; formats: string[] } {
  const text = ` ${name.toLowerCase()} ${company.toLowerCase()} `;

  const topics = Object.entries(TOPIC_RULES)
    .filter(([, keywords]) => matchKeywords(text, keywords))
    .map(([topic]) => topic);

  const formats = Object.entries(FORMAT_RULES)
    .filter(([, keywords]) => matchKeywords(text, keywords))
    .map(([format]) => format);

  return { topics, formats };
}

interface RawEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string | null;
  company: string | null;
  externalHref: string | null;
  isInviteOnly: boolean;
  facets: {
    time?: { label: string };
  };
}

// Module-level cache so concurrent calls (e.g. /en/nyc + /fr/nyc at build) don't scrape twice
let _cachedPromise: Promise<TechWeekEvent[]> | null = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function fetchAllEvents(): Promise<TechWeekEvent[]> {
  const now = Date.now();
  if (_cachedPromise && now - _cacheTime < CACHE_TTL) {
    return _cachedPromise;
  }
  _cachedPromise = _fetchAllEventsImpl();
  _cacheTime = now;
  return _cachedPromise;
}

async function _fetchAllEventsImpl(): Promise<TechWeekEvent[]> {
  const allEvents: TechWeekEvent[] = [];
  let page = 1;

  while (page <= 40) {
    const payload = JSON.stringify({
      "0": {
        city: "nyc",
        q: "",
        featured: false,
        day: "all",
        track: [],
        sponsor: [],
        theme: [],
        format: [],
        location: [],
        time: [],
        host: [],
        sortBy: "time",
        sortOrder: "asc",
        cursor: page,
        direction: "forward",
      },
    });

    const res = await fetch(TECH_WEEK_API, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://www.tech-week.com",
        referer: "https://www.tech-week.com/calendar/nyc",
      },
      body: payload,
      next: { revalidate: 300 },
    });

    if (!res.ok) break;

    const data = await res.json();
    const results: RawEvent[] = data[0]?.result?.data?.results ?? [];
    if (results.length === 0) break;

    for (const raw of results) {
      const { topics, formats } = classifyEvent(
        raw.name ?? "",
        raw.company ?? ""
      );

      allEvents.push({
        id: raw.id,
        name: raw.name,
        date: raw.date,
        time: raw.time,
        location: raw.location ?? "",
        company: raw.company ?? "",
        url: raw.externalHref ?? "",
        isInviteOnly: raw.isInviteOnly,
        topics,
        formats,
        timeOfDay: (raw.facets?.time?.label as TechWeekEvent["timeOfDay"]) ?? "Evening",
      });
    }

    if (results.length < PER_PAGE) break;
    page++;
  }

  const partifulUrls = allEvents
    .filter((e) => e.url && e.url.includes("partiful.com"))
    .map((e) => ({ id: e.id, url: e.url }));

  if (partifulUrls.length > 0) {
    const partifulData = await scrapeAllPartifulData(partifulUrls);
    for (const event of allEvents) {
      const data = partifulData.get(event.id);
      if (data) {
        event.partiful = data;
      }
    }
    console.log(
      `Enriched ${partifulData.size}/${partifulUrls.length} events with Partiful data`
    );
  }

  return allEvents;
}

export const TOPICS = Object.keys(TOPIC_RULES);
export const FORMATS = Object.keys(FORMAT_RULES);

export const DAYS = [
  { value: "2026-06-01", label: "Mon Jun 1" },
  { value: "2026-06-02", label: "Tue Jun 2" },
  { value: "2026-06-03", label: "Wed Jun 3" },
  { value: "2026-06-04", label: "Thu Jun 4" },
  { value: "2026-06-05", label: "Fri Jun 5" },
  { value: "2026-06-06", label: "Sat Jun 6" },
  { value: "2026-06-07", label: "Sun Jun 7" },
];

export const NEIGHBORHOODS = [
  "Midtown",
  "SoHo",
  "Flatiron",
  "Chelsea",
  "Financial District",
  "Union Square",
  "Brooklyn",
  "Nomad",
  "Lower East Side",
  "East Village",
  "Tribeca",
  "West Village",
  "Hudson Yards",
  "Greenwich Village",
  "Meatpacking District",
  "Chinatown",
  "Upper East Side",
  "Upper Manhattan",
];

export const TOPIC_COLORS: Record<string, string> = {
  "AI/ML": "bg-gray-900 text-white border-gray-900",
  "Dev/Engineering": "bg-gray-900 text-white border-gray-900",
  SaaS: "bg-gray-900 text-white border-gray-900",
  "Product/Growth": "bg-gray-900 text-white border-gray-900",
  "Crypto/Web3": "bg-gray-900 text-white border-gray-900",
  Fintech: "bg-gray-900 text-white border-gray-900",
  "VC/Investing": "bg-gray-900 text-white border-gray-900",
  "Founder/Startup": "bg-gray-900 text-white border-gray-900",
  "Climate/Energy": "bg-gray-900 text-white border-gray-900",
  "Sports/Fitness": "bg-gray-900 text-white border-gray-900",
  Healthcare: "bg-gray-900 text-white border-gray-900",
  "Women/Diversity": "bg-gray-900 text-white border-gray-900",
  Legal: "bg-gray-900 text-white border-gray-900",
  Consumer: "bg-gray-900 text-white border-gray-900",
  "Real Estate": "bg-gray-900 text-white border-gray-900",
  "Social/Party": "bg-gray-900 text-white border-gray-900",
  "Design/Creative": "bg-gray-900 text-white border-gray-900",
  "Media/Content": "bg-gray-900 text-white border-gray-900",
};

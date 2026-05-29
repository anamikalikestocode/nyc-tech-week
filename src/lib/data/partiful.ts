export interface PartifulData {
  guestCount: number;
  pendingCount: number;
  approvedCount: number;
  goingCount: number;
  interestedCount: number;
  waitlistCount: number;
  atCapacity: boolean;
  isCapped: boolean;
  rsvpsEnabled: boolean;
  guestAction: string;
  maxCapacity: number | null;
  description: string;
  imageUrl: string | null;
  neighborhood: string | null;
  hasTickets: boolean;
}

export async function scrapePartifulEvent(
  url: string
): Promise<PartifulData | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(
      /<script\s+id="__NEXT_DATA__"\s+type="application\/json">\s*([\s\S]*?)\s*<\/script>/
    );
    if (!match) return null;

    const nextData = JSON.parse(match[1]);
    const event = nextData?.props?.pageProps?.event;
    if (!event) return null;

    return {
      guestCount: event.guestCount ?? 0,
      pendingCount: event.pendingGuestCount ?? 0,
      approvedCount: event.approvedGuestCount ?? 0,
      goingCount: event.goingGuestCount ?? 0,
      interestedCount: event.interestedGuestCount ?? 0,
      waitlistCount: event.waitlistGuestCount ?? 0,
      atCapacity: event.atCapacity ?? false,
      isCapped: event.isCapped ?? false,
      rsvpsEnabled: event.rsvpsEnabled ?? false,
      guestAction: event.guestAction ?? "RSVP",
      maxCapacity: event.maxCapacity ?? null,
      description: event.description ?? "",
      imageUrl: event.image?.url ?? null,
      neighborhood: event.locationInfo?.neighborhood ?? null,
      hasTickets:
        Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0,
    };
  } catch {
    return null;
  }
}

export async function scrapeAllPartifulData(
  urls: Array<{ id: number; url: string }>
): Promise<Map<number, PartifulData>> {
  const results = new Map<number, PartifulData>();
  const partifulUrls = urls.filter(({ url }) => url.includes("partiful.com"));
  const total = partifulUrls.length;
  let completed = 0;

  const maxConcurrency = 25;
  let active = 0;
  let index = 0;

  return new Promise((resolve) => {
    function next() {
      while (active < maxConcurrency && index < partifulUrls.length) {
        const { id, url } = partifulUrls[index++];
        active++;

        scrapePartifulEvent(url).then((data) => {
          if (data) {
            results.set(id, data);
          }
          completed++;
          active--;

          if (completed % 50 === 0 || completed === total) {
            console.log(`Scraped ${completed}/${total} Partiful pages`);
          }

          if (completed === total) {
            resolve(results);
          } else {
            next();
          }
        });
      }
    }

    if (partifulUrls.length === 0) {
      resolve(results);
      return;
    }

    next();
  });
}

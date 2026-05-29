import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYC Tech Week 2026 — Event Directory",
  description:
    "Find the best NYC Tech Week events. 1,600+ events with smart filters by topic, day, neighborhood, and vibe. Built for the community.",
  openGraph: {
    title: "NYC Tech Week 2026 — Event Directory",
    description:
      "1,600+ events. Smart filters. Find your perfect NYC Tech Week lineup in seconds.",
  },
};

export default function NycLayout({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter><div className="font-sans">{children}</div></NuqsAdapter>;
}

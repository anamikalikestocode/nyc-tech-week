import { Suspense } from "react";
import { fetchAllEvents } from "@/lib/data/events";
import { EventDirectory } from "@/components/nyc/event-directory";

export const revalidate = 300;

export default async function NycTechWeekPage() {
  const events = await fetchAllEvents();

  const totalGuests = events.reduce(
    (sum, e) => sum + (e.partiful?.guestCount ?? 0),
    0
  );
  const fullEvents = events.filter((e) => e.partiful?.atCapacity).length;
  const avgApproval = (() => {
    const applyEvents = events.filter(
      (e) =>
        e.partiful?.guestAction === "APPLY" &&
        (e.partiful.approvedCount + e.partiful.pendingCount) > 0
    );
    if (applyEvents.length === 0) return 0;
    const total = applyEvents.reduce((sum, e) => {
      const p = e.partiful!;
      return sum + p.approvedCount / (p.approvedCount + p.pendingCount);
    }, 0);
    return Math.round((total / applyEvents.length) * 100);
  })();

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            NYC Tech Week — What Partiful Does{" "}
            <span className="underline decoration-red-400 decoration-wavy underline-offset-4">
              NOT
            </span>{" "}
            Show You
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            a16z tech week website is kinda bad so here is a better one
          </p>

          {/* Ticker-style stats */}
          <div className="mt-4 flex w-fit flex-wrap items-stretch divide-x divide-gray-800 border border-gray-800">
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs">
              <span className="uppercase tracking-widest text-gray-500">EVT</span>
              <span className="font-black text-[#00FF9C]">{events.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs">
              <span className="uppercase tracking-widest text-gray-500">RSVPs</span>
              <span className="font-black text-[#00FF9C]">{totalGuests.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs">
              <span className="uppercase tracking-widest text-gray-500">FULL</span>
              <span className="font-black text-[#FF3B30]">{fullEvents}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs">
              <span className="uppercase tracking-widest text-gray-500">AVG APPR</span>
              <span className="font-black text-[#00FF9C]">{avgApproval}%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00FF9C] opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#00FF9C]" />
              </span>
              <span className="uppercase tracking-widest text-gray-500">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        <EventDirectory events={events} />
      </Suspense>
    </main>
  );
}

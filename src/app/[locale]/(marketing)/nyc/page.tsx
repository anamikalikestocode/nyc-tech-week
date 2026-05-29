import { Suspense } from "react";
import { fetchAllEvents } from "@/lib/data/events";
import { EventDirectory } from "@/components/nyc/event-directory";

export const revalidate = 300;

function StatCell({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  const valueColor = danger ? "text-[#D8442B]" : accent ? "text-[#0A8F5A]" : "text-[#1C1A14]";
  return (
    <div className="flex flex-col items-center px-5 py-3">
      <span className={"text-xl font-extrabold tabular-nums tracking-[-0.02em] " + valueColor}>{value}</span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#766E5C]">{label}</span>
    </div>
  );
}

export default async function NycTechWeekPage() {
  const events = await fetchAllEvents();

  const totalGuests = events.reduce((sum, e) => {
    const p = e.partiful;
    if (!p) return sum;
    return sum + (p.guestAction === "APPLY" ? p.approvedCount : p.guestCount);
  }, 0);
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
    <main className="min-h-screen bg-[#E9E2D3]">
      <div className="border-b border-[#DDD3BD] bg-[#E9E2D3]">
        <div className="mx-auto max-w-[1200px] px-[22px] pb-8 pt-10">
          {/* H1 — clamp(36px,5.4vw,60px), extrabold, tracking -0.035em, line-height 0.98 */}
          <h1 className="font-extrabold leading-[0.98] tracking-[-0.035em] text-[#1C1A14]" style={{ fontSize: "clamp(36px,5.4vw,60px)" }}>
            NYC Tech Week
          </h1>

          {/* Lede */}
          <p className="mt-3 max-w-[600px] text-base leading-[1.55] text-[#766E5C]">
            The a16z tech week website is kinda bad, so here&apos;s a better one.
          </p>

          {/* Stat ticker */}
          <div className="mt-5 grid w-full grid-cols-4 items-stretch divide-x divide-[#CDC1A6] rounded-xl border border-[#CDC1A6] bg-[#F7F2E7] sm:w-fit sm:flex">
            <StatCell label="Events" value={events.length.toLocaleString()} />
            <StatCell label="RSVPs" value={totalGuests.toLocaleString()} accent />
            <StatCell label="Full" value={String(fullEvents)} danger />
            <StatCell label="Avg approval" value={`${avgApproval}%`} accent />
          </div>
        </div>
      </div>

      <Suspense>
        <EventDirectory events={events} />
      </Suspense>
    </main>
  );
}

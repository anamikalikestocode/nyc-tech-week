"use client";
import { TOPIC_COLORS, type TechWeekEvent } from "@/lib/data/events";
import { Clock, MapPin, ExternalLink, Lock, Calendar } from "lucide-react";
import { trackRsvpClick } from "@/lib/nyc-session";

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return m === "00" ? `${h12}${ampm}` : `${h12}:${m}${ampm}`;
}

function formatDate(date: string): string {
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function CompanyLogo({ company }: { company: string }) {
  if (!company) return null;
  const domain = company.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  // Render the logo as a CSS background-image, NOT an <img>. A failed or
  // still-loading background-image shows nothing (just the neutral tan box) —
  // the browser never paints its broken-image "?" glyph. An <img> would flash
  // that glyph during the pre-hydration window before the onError handler runs
  // (very visible in the Twitter in-app browser). Pure CSS, no JS, so it
  // behaves identically before and after hydration. The company name is shown
  // right next to this box, so no letter fallback is needed.
  return (
    <span
      aria-hidden="true"
      className="inline-block size-[18px] shrink-0 rounded-[5px] bg-[#F0E8D9] bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: `url(https://logo.clearbit.com/${domain})` }}
    />
  );
}

function StatusBadge({ event }: { event: TechWeekEvent }) {
  const p = event.partiful;
  if (p?.atCapacity) {
    return <span className="shrink-0 rounded-full bg-[#D8442B]/10 px-2 py-0.5 text-[10.5px] font-bold uppercase text-[#D8442B]">Full</span>;
  }
  if (event.isInviteOnly) {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#DDD3BD] bg-[#F0E8D9] px-2 py-0.5 text-[10.5px] font-medium text-[#766E5C]">
        <Lock className="size-2.5" /> Invite only
      </span>
    );
  }
  if (p?.isCapped && p.maxCapacity && !p.atCapacity) {
    const left = Math.max(0, p.maxCapacity - p.guestCount);
    if (left > 0 && left <= 20) {
      return <span className="shrink-0 rounded-full bg-[#00FF9C]/20 px-2 py-0.5 text-[10.5px] font-bold text-[#0A8F5A]">{left} left</span>;
    }
  }
  return null;
}

// Keep TOPIC_COLORS imported to avoid unused import lint error (used indirectly if needed later)
void TOPIC_COLORS;

// Circular approval-rate gauge: a ring with the % in the middle. Replaces the
// old full-width bar — frees the whole horizontal strip for other content and
// reads faster. Low rates (<=30%) go red, healthy ones green. Pure SVG, no JS.
function ApprovalRing({ rate }: { rate: number }) {
  const size = 50;
  const stroke = 4.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, rate));
  const dashOffset = circumference * (1 - pct / 100);
  const low = rate <= 30;
  const color = low ? "#D8442B" : "#0A8F5A";
  const track = low ? "#EAD3CC" : "#CDC1A6";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={`${rate}% approval rate`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-[500ms] ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={"tabular-nums text-[14px] font-extrabold leading-none " + (low ? "text-[#D8442B]" : "text-[#1C1A14]")}>
          {rate}
          <span className="text-[12px] font-bold">%</span>
        </span>
      </div>
    </div>
  );
}

export function EventCard({ event }: { event: TechWeekEvent }) {
  const p = event.partiful;
  // Approval rate needs the "applied but not yet approved" signal (pendingCount,
  // derived from Partiful's respondedGuestCount). Partiful stripped that field
  // from the public payload, so pendingCount is now ~always 0 — and
  // approved/(approved+0) would render a fake 100%. Only show the rate when a
  // real pending signal exists; otherwise suppress the ring entirely (the
  // approved/going count below still shows, since that data survived).
  const approvalRate =
    p && p.guestAction === "APPLY" && p.pendingCount > 0
      ? Math.round((p.approvedCount / (p.approvedCount + p.pendingCount)) * 100)
      : null;

  return (
    <a
      href={event.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={
        event.url
          ? () =>
              trackRsvpClick({
                eventUrl: event.url,
                eventName: event.name,
                source: "card",
              })
          : undefined
      }
      className={
        "group flex flex-col gap-[11px] rounded-[14px] border border-[#DDD3BD] bg-[#F7F2E7] p-4 transition-all duration-[160ms] " +
        (event.url ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#00FF9C] hover:shadow-[0_16px_34px_-18px_rgba(40,30,10,0.3)]" : "cursor-default")
      }
    >
      {/* Top: company logo + name | status badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CompanyLogo company={event.company} />
          <span className="truncate text-[12px] text-[#766E5C]">{event.company || "—"}</span>
        </div>
        <StatusBadge event={event} />
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.28] tracking-[-0.01em] text-[#1C1A14] transition-colors duration-[160ms] group-hover:text-[#0A8F5A]">
        {event.name}
      </h3>

      {/* Meta: date · time · location */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#766E5C]">
        <span className="flex items-center gap-1"><Calendar className="size-[13px] text-[#A79E89]" />{formatDate(event.date)}</span>
        <span className="flex items-center gap-1"><Clock className="size-[13px] text-[#A79E89]" />{formatTime(event.time)}</span>
        <span className="flex items-center gap-1"><MapPin className="size-[13px] text-[#A79E89]" /><span className="truncate">{p?.neighborhood || event.location || "TBA"}</span></span>
      </div>

      {/* Attendance + approval */}
      {p && (p.guestAction === "APPLY" ? p.approvedCount > 0 : p.guestCount > 0) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-2xl font-extrabold tabular-nums tracking-[-0.03em] text-[#1C1A14]">
              {(p.guestAction === "APPLY" ? p.approvedCount : p.guestCount).toLocaleString()}
            </span>
            <span className="text-[10.5px] text-[#766E5C]">{p.guestAction === "APPLY" ? "approved" : "going"}</span>
          </div>
          {approvalRate !== null && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#766E5C]">approval</span>
              <ApprovalRing rate={approvalRate} />
            </div>
          )}
        </div>
      )}

      {/* Topic chips */}
      {event.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="rounded-full border border-[#DDD3BD] bg-[#F0E8D9] px-2 py-0.5 text-[11px] font-medium text-[#1C1A14]">{topic}</span>
          ))}
          {event.formats?.[0] && (
            <span className="rounded-full border border-[#DDD3BD] px-2 py-0.5 text-[11px] font-medium text-[#766E5C]">{event.formats[0]}</span>
          )}
        </div>
      )}

      {/* RSVP footer */}
      {event.url && (
        <div className="mt-auto flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-[#766E5C] transition-colors duration-[160ms] group-hover:text-[#0A8F5A]">
          RSVP on Partiful <ExternalLink className="size-3" />
        </div>
      )}
    </a>
  );
}

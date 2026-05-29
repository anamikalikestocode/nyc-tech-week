"use client";
import { TOPIC_COLORS, type TechWeekEvent } from "@/lib/data/events";
import { Clock, MapPin, ExternalLink, Lock, Calendar } from "lucide-react";

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
  return (
    <span className="relative inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-[#F0E8D9]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt=""
        className="absolute inset-0 size-full object-contain"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = "none";
          const fb = img.nextElementSibling as HTMLElement | null;
          if (fb) fb.style.display = "flex";
        }}
      />
      <span className="absolute inset-0 hidden items-center justify-center text-[9px] font-medium text-[#766E5C]">
        {company[0]?.toUpperCase()}
      </span>
    </span>
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

export function EventCard({ event }: { event: TechWeekEvent }) {
  const p = event.partiful;
  const total = p ? p.approvedCount + p.pendingCount : 0;
  const approvalRate = p && p.guestAction === "APPLY" && total > 0
    ? Math.round((p.approvedCount / total) * 100) : null;

  return (
    <a
      href={event.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
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
      {p && p.guestCount > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-2xl font-extrabold tabular-nums tracking-[-0.03em] text-[#1C1A14]">{p.guestCount.toLocaleString()}</span>
            <span className="text-[10.5px] text-[#766E5C]">going</span>
          </div>
          {approvalRate !== null && (
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#766E5C]">approval</span>
                <span className={"tabular-nums text-[12px] font-bold " + (approvalRate <= 30 ? "text-[#D8442B]" : "text-[#1C1A14]")}>{approvalRate}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#CDC1A6]">
                <div
                  className="h-1.5 rounded-full transition-[width] duration-[400ms]"
                  style={{ width: `${Math.min(100, approvalRate)}%`, background: approvalRate <= 30 ? "#D8442B" : "#00FF9C" }}
                />
              </div>
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

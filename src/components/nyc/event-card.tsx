"use client";
import { TOPIC_COLORS, type TechWeekEvent } from "@/lib/data/events";
import { Clock, MapPin, ExternalLink, Lock, Calendar } from "lucide-react";

const PILL_CLASSES: Record<string, string> = {
  blue: "bg-blue-950/60 text-blue-400 border-blue-800/50",
  green: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  red: "bg-red-950/60 text-red-400 border-red-800/50",
  yellow: "bg-amber-950/60 text-amber-400 border-amber-800/50",
};

function topicPill(topic: string): string {
  const key = TOPIC_COLORS[topic] ?? "";
  return PILL_CLASSES[key] ?? "bg-gray-800 text-gray-400 border-gray-700";
}

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt=""
      className="size-4 rounded object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

export function EventCard({ event }: { event: TechWeekEvent }) {
  const p = event.partiful;
  const total = p ? p.approvedCount + p.pendingCount : 0;
  const approvalRate =
    p && p.guestAction === "APPLY" && total > 0
      ? Math.round((p.approvedCount / total) * 100)
      : null;

  return (
    <a
      href={event.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "group flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-4 transition-all " +
        (event.url
          ? "cursor-pointer hover:border-gray-600 hover:shadow-lg hover:shadow-black/40"
          : "cursor-default")
      }
    >
      {/* Event name + status badge */}
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <h3 className="flex-1 text-[15px] font-bold leading-snug text-white transition-colors line-clamp-2 group-hover:text-[#00FF9C]">
          {event.name}
        </h3>
        {p?.atCapacity ? (
          <span className="shrink-0 rounded bg-red-950 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-400">
            FULL
          </span>
        ) : event.isInviteOnly ? (
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-amber-500">
            <Lock className="size-2.5" />
            Invite only
          </span>
        ) : null}
      </div>

      {/* Date / location / company */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <Calendar className="size-3 shrink-0 text-gray-600" />
          <span>{formatDate(event.date)}</span>
          <span className="text-gray-700">·</span>
          <Clock className="size-3 shrink-0 text-gray-600" />
          <span>{formatTime(event.time)}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-gray-500">
          <MapPin className="size-3 shrink-0 text-gray-600" />
          <span className="truncate">
            {p?.neighborhood || event.location || "TBA"}
          </span>
          {event.company && (
            <>
              <span className="shrink-0 text-gray-700">·</span>
              <CompanyLogo company={event.company} />
              <span className="truncate">{event.company}</span>
            </>
          )}
        </div>
      </div>

      {/* Attendance + approval */}
      {p && p.guestCount > 0 && (
        <div className="mb-3 flex items-center gap-3">
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="font-mono text-xl font-black leading-none text-[#00FF9C]">
              {p.guestCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-600">going</span>
          </div>

          {approvalRate !== null && (
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-gray-600">approval</span>
                <span
                  className={
                    "font-mono text-[11px] font-bold " +
                    (approvalRate <= 30 ? "text-red-400" : "text-[#00FF9C]")
                  }
                >
                  {approvalRate}%
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-gray-800">
                <div
                  className={
                    "h-1 rounded-full transition-all " +
                    (approvalRate <= 30 ? "bg-red-500" : "bg-[#00FF9C]")
                  }
                  style={{ width: `${Math.min(100, approvalRate)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Topic tags */}
      {event.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {event.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className={
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium " +
                topicPill(topic)
              }
            >
              {topic}
            </span>
          ))}
          {event.formats && event.formats.length > 0 && (
            <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-400">
              {event.formats[0]}
            </span>
          )}
        </div>
      )}

      {/* RSVP */}
      {event.url && (
        <div className="mt-3 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-gray-600 transition-colors group-hover:text-[#00FF9C]">
          RSVP on Partiful <ExternalLink className="size-3" />
        </div>
      )}
    </a>
  );
}

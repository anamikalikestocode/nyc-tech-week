"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
} from "nuqs";
import type { TechWeekEvent } from "@/lib/data/events";
import { EventCard } from "./event-card";
import { FilterBar } from "./filter-bar";
import { EventChat } from "./event-chat";

function getGuestCount(e: TechWeekEvent): number {
  const p = e.partiful;
  if (!p) return 0;
  return p.guestAction === "APPLY" ? p.approvedCount : p.guestCount;
}

function getFillPct(e: TechWeekEvent): number {
  const p = e.partiful;
  if (!p) return 0;
  if (p.isCapped && p.maxCapacity && p.maxCapacity > 0)
    return p.guestCount / p.maxCapacity;
  return p.guestCount;
}

function getSpotsRemaining(e: TechWeekEvent): number {
  const p = e.partiful;
  if (!p) return Infinity;
  if (!p.isCapped || !p.maxCapacity) return Infinity;
  if (p.atCapacity) return 0;
  return Math.max(0, p.maxCapacity - p.guestCount);
}

function sortEvents(events: TechWeekEvent[], sort: string): TechWeekEvent[] {
  const copy = [...events];
  switch (sort) {
    case "popular":
      return copy.sort((a, b) => getGuestCount(b) - getGuestCount(a));
    case "filling":
      return copy.sort((a, b) => getFillPct(b) - getFillPct(a));
    case "available": {
      return copy.sort((a, b) => {
        const aSpots = getSpotsRemaining(a);
        const bSpots = getSpotsRemaining(b);
        const aFinite = isFinite(aSpots) ? 0 : 1;
        const bFinite = isFinite(bSpots) ? 0 : 1;
        if (aFinite !== bFinite) return aFinite - bFinite;
        return bSpots - aSpots;
      });
    }
    case "date":
    default:
      return copy.sort((a, b) => {
        const d = a.date.localeCompare(b.date);
        if (d !== 0) return d;
        return a.time.localeCompare(b.time);
      });
  }
}

export function EventDirectory({ events }: { events: TechWeekEvent[] }) {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [selectedDays, setSelectedDays] = useQueryState(
    "day",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedTopics, setSelectedTopics] = useQueryState(
    "topic",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedTimes, setSelectedTimes] = useQueryState(
    "time",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useQueryState(
    "hood",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("date")
  );

  const [visibleCount, setVisibleCount] = useState(60);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return events.filter((e) => {
      if (selectedDays.length > 0 && !selectedDays.includes(e.date))
        return false;

      if (
        selectedTopics.length > 0 &&
        !selectedTopics.some((t) => e.topics.includes(t))
      )
        return false;

      if (
        selectedTimes.length > 0 &&
        !selectedTimes.includes(e.timeOfDay)
      )
        return false;

      if (
        selectedNeighborhoods.length > 0 &&
        !selectedNeighborhoods.some((n) =>
          e.location.toLowerCase().includes(n.toLowerCase())
        )
      )
        return false;

      if (q) {
        const haystack =
          `${e.name} ${e.company} ${e.topics.join(" ")} ${e.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [
    events,
    search,
    selectedDays,
    selectedTopics,
    selectedTimes,
    selectedNeighborhoods,
  ]);

  const sorted = useMemo(() => sortEvents(filtered, sort), [filtered, sort]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 60);
  }, []);

  return (
    <div className="min-h-screen bg-[#E9E2D3]">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedDays={selectedDays}
        onDaysChange={setSelectedDays}
        selectedTopics={selectedTopics}
        onTopicsChange={setSelectedTopics}
        selectedTimes={selectedTimes}
        onTimesChange={setSelectedTimes}
        selectedNeighborhoods={selectedNeighborhoods}
        onNeighborhoodsChange={setSelectedNeighborhoods}
        sort={sort}
        onSortChange={setSort}
        totalCount={events.length}
        filteredCount={filtered.length}
      />

      <div className="mx-auto max-w-[1200px] px-[22px] py-6">
        <EventChat events={events} />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-4xl text-[#A79E89]">—</div>
            <h3 className="mb-1 text-[17px] font-bold text-[#1C1A14]">
              No events found
            </h3>
            <p className="text-sm text-[#766E5C]">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  className="rounded-full border border-[#CDC1A6] bg-[#F7F2E7] px-6 py-2.5 text-[13px] font-semibold text-[#766E5C] hover:border-[#00FF9C] hover:text-[#0A8F5A] transition-all"
                >
                  Load more ({sorted.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

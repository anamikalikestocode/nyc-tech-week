"use client";

import {
  DAYS,
  TOPICS,
  NEIGHBORHOODS,
  TOPIC_COLORS,
} from "@/lib/data/events";
import { Search, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedDays: string[];
  onDaysChange: (v: string[]) => void;
  selectedTopics: string[];
  onTopicsChange: (v: string[]) => void;
  selectedTimes: string[];
  onTimesChange: (v: string[]) => void;
  selectedNeighborhoods: string[];
  onNeighborhoodsChange: (v: string[]) => void;
  hideInviteOnly: boolean;
  onHideInviteOnlyChange: (v: boolean) => void;
  showAlmostFull: boolean;
  onShowAlmostFullChange: (v: boolean) => void;
  sort: string;
  onSortChange: (v: string) => void;
  totalCount: number;
  filteredCount: number;
}

const SORT_OPTIONS = [
  { value: "date", label: "Date & Time" },
  { value: "popular", label: "Most Popular" },
  { value: "filling", label: "Filling Fast" },
  { value: "available", label: "Spots Available" },
] as const;

const TIMES = ["Morning", "Afternoon", "Evening", "Noon"];

const DOT_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
};

function topicDotClass(topic: string): string {
  const key = TOPIC_COLORS[topic] ?? "";
  return DOT_COLORS[key] ?? "bg-gray-500";
}

function TogglePill({
  label,
  active,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-medium font-mono transition-all ${
        active
          ? "border-[#00FF9C] bg-[#00FF9C] text-gray-900"
          : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
      } ${className}`}
    >
      {label}
    </button>
  );
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function DropdownFilter({
  label,
  options,
  selected,
  onChange,
  colorMap,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  colorMap?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex shrink-0 items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium font-mono transition-all ${
          selected.length > 0
            ? "border-[#00FF9C] bg-[#00FF9C] text-gray-900"
            : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-[#00FF9C]">
            {selected.length}
          </span>
        )}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-56 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-lg shadow-black/40">
          {options.map((opt) => {
            const isActive = selected.includes(opt);
            const color = colorMap?.[opt];
            return (
              <button
                key={opt}
                onClick={() => onChange(toggle(selected, opt))}
                className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs font-mono transition-colors ${
                  isActive ? "bg-gray-800 font-medium text-[#00FF9C]" : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                }`}
              >
                {color && (
                  <span className={"size-1.5 rounded-full shrink-0 " + topicDotClass(opt)} />
                )}
                <span className="truncate">{opt}</span>
                {isActive && <span className="ml-auto text-[#00FF9C]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];
  const isNonDefault = value !== "date";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex shrink-0 items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium font-mono transition-all ${
          isNonDefault
            ? "border-[#00FF9C] bg-[#00FF9C] text-gray-900"
            : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
        }`}
      >
        Sort: {current.label}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-lg shadow-black/40">
          {SORT_OPTIONS.map((opt) => {
            const isActive = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs font-mono transition-colors ${
                  isActive
                    ? "bg-gray-800 font-medium text-[#00FF9C]"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isActive && <span className="ml-auto text-[#00FF9C]">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterBar(props: FilterBarProps) {
  const {
    search,
    onSearchChange,
    selectedDays,
    onDaysChange,
    selectedTopics,
    onTopicsChange,
    selectedTimes,
    onTimesChange,
    selectedNeighborhoods,
    onNeighborhoodsChange,
    hideInviteOnly,
    onHideInviteOnlyChange,
    showAlmostFull,
    onShowAlmostFullChange,
    sort,
    onSortChange,
    totalCount,
    filteredCount,
  } = props;

  const hasFilters =
    search ||
    selectedDays.length > 0 ||
    selectedTopics.length > 0 ||
    selectedTimes.length > 0 ||
    selectedNeighborhoods.length > 0 ||
    hideInviteOnly ||
    showAlmostFull;

  function clearAll() {
    onSearchChange("");
    onDaysChange([]);
    onTopicsChange([]);
    onTimesChange([]);
    onNeighborhoodsChange([]);
    onHideInviteOnlyChange(false);
    onShowAlmostFullChange(false);
  }

  return (
    <div className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search events, hosts, topics..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 outline-none transition-all focus:border-gray-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Day pills */}
        <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {DAYS.map((day) => (
            <TogglePill
              key={day.value}
              label={day.label}
              active={selectedDays.includes(day.value)}
              onClick={() => onDaysChange(toggle(selectedDays, day.value))}
            />
          ))}
        </div>

        {/* Dropdowns + toggles */}
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <DropdownFilter
            label="Topic"
            options={TOPICS}
            selected={selectedTopics}
            onChange={onTopicsChange}
            colorMap={TOPIC_COLORS}
          />
          <DropdownFilter
            label="Time"
            options={TIMES}
            selected={selectedTimes}
            onChange={onTimesChange}
          />
          <DropdownFilter
            label="Neighborhood"
            options={NEIGHBORHOODS}
            selected={selectedNeighborhoods}
            onChange={onNeighborhoodsChange}
          />
          <TogglePill
            label="Hide Invite-Only"
            active={hideInviteOnly}
            onClick={() => onHideInviteOnlyChange(!hideInviteOnly)}
          />
          <TogglePill
            label="Almost Full"
            active={showAlmostFull}
            onClick={() => onShowAlmostFullChange(!showAlmostFull)}
          />

          {hasFilters && (
            <button
              onClick={clearAll}
              className="shrink-0 flex items-center gap-1 rounded-full border border-red-800 bg-red-900/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/50 transition-colors"
            >
              <X className="size-3" />
              Clear all
            </button>
          )}

          <SortDropdown value={sort} onChange={onSortChange} />

          <span className="ml-auto shrink-0 font-mono text-xs text-gray-400">
            {filteredCount === totalCount
              ? `${totalCount} events`
              : `${filteredCount} of ${totalCount}`}
          </span>
        </div>
      </div>
    </div>
  );
}

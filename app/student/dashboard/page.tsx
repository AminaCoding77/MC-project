"use client";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

type EventColor = "orange" | "green" | "purple" | "blue";
type CalEvent = { id: string; label: string; color: EventColor };
type EventMap = Record<string, CalEvent[]>;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EVENT_STYLES: Record<EventColor, string> = {
  orange: "bg-orange-500/20 text-orange-400",
  green: "bg-green-500/20 text-green-400",
  purple: "bg-purple-500/20 text-purple-300",
  blue: "bg-blue-500/20 text-blue-400",
};

const EVENTS: EventMap = {
  "2026-3-2": [{ id: "1", label: "Study Group", color: "green" }],
  "2026-3-7": [{ id: "2", label: "Midterm Exam", color: "orange" }],
  "2026-3-8": [{ id: "3", label: "Lab Report", color: "purple" }],
  "2026-3-10": [{ id: "4", label: "Advisor Mtg", color: "blue" }],
  // ... add more as needed
};

// Generate 42 cells for calendar grid
function getDaysGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; currentMonth: boolean }[] = [];

  // Previous month's trailing days
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + i + 1, currentMonth: false });

  // Current month
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, currentMonth: true });

  // Next month's leading days to fill 42 cells
  for (let i = 1; i <= 42 - cells.length; i++)
    cells.push({ day: i, currentMonth: false });

  return cells;
}

// Single day cell
function DayCell({
  day,
  currentMonth,
  isToday,
  events,
  selected,
  onClick,
}: {
  day: number;
  currentMonth: boolean;
  isToday: boolean;
  events: CalEvent[];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col p-2 cursor-pointer overflow-hidden transition-colors duration-100
        ${!currentMonth ? "opacity-30" : ""}
        ${selected ? "bg-blue-500/10" : isToday ? "bg-blue-500/[0.07]" : "bg-[#13161d] hover:bg-[#1a1e28]"}
      `}
    >
      {isToday && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
      )}

      <div className="mb-1 shrink-0">
        {isToday ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-semibold">
            {day}
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-500">{day}</span>
        )}
      </div>

      <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
        {events.slice(0, 2).map((ev) => (
          <div
            key={ev.id}
            className={`text-[9px] font-medium px-1.5 py-0.5 rounded truncate shrink-0 ${EVENT_STYLES[ev.color]}`}
          >
            {ev.label}
          </div>
        ))}
        {events.length > 2 && (
          <span className="text-[9px] text-gray-500 px-1.5">
            +{events.length - 2} more
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const now = new Date();
  const [current, setCurrent] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { year, month } = current;
  const cells = getDaysGrid(year, month);

  const goPrev = () =>
    setCurrent((c) =>
      c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { ...c, month: c.month - 1 },
    );
  const goNext = () =>
    setCurrent((c) =>
      c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { ...c, month: c.month + 1 },
    );
  const goToday = () => {
    setCurrent({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDay(now.getDate());
  };

  return (
    <div className="flex h-screen w-full bg-[#0d0f14] text-white overflow-hidden">
      <Sidebar userRole="student" />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#13161d] border-b border-white/[0.06] shrink-0">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-[22px] font-semibold tracking-tight">
              {MONTHS[month]}
            </h1>
            <span className="text-sm text-gray-500">{year}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Navigation */}
            <button
              onClick={goPrev}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1e28] border border-white/10 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ←
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1e28] border border-white/10 text-gray-400 hover:text-white transition-colors text-sm"
            >
              →
            </button>
            <button
              onClick={goToday}
              className="ml-1 px-3.5 py-1.5 rounded-lg bg-[#1a1e28] border border-white/10 text-gray-400 hover:text-white text-xs font-medium transition-colors"
            >
              Today
            </button>
            <button className="ml-1 px-3.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium transition-colors">
              ＋ Event
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 bg-[#13161d] border-b border-white/[0.06] shrink-0">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center py-2.5 text-[10px] font-semibold tracking-widest uppercase ${i === 0 || i === 6 ? "text-gray-600" : "text-gray-500"}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-white/[0.05] overflow-hidden">
          {cells.map((cell, i) => {
            const key = cell.currentMonth
              ? `${year}-${month}-${cell.day}`
              : null;
            const events: CalEvent[] = key ? (EVENTS[key] ?? []) : [];
            const isToday =
              cell.currentMonth &&
              now.getFullYear() === year &&
              now.getMonth() === month &&
              now.getDate() === cell.day;

            return (
              <DayCell
                key={i}
                day={cell.day}
                currentMonth={cell.currentMonth}
                isToday={isToday}
                events={events}
                selected={cell.currentMonth && selectedDay === cell.day}
                onClick={() => {
                  if (cell.currentMonth) setSelectedDay(cell.day);
                }}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

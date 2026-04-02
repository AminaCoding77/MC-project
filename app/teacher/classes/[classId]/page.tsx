"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────
type EventType = "event" | "assignment" | "exam";
type EventTypea = {
  _id: string;
  title: string;
  description?: string;
  type: "exam" | "event" | "assignment";
  date: string; // ✅ THIS is what backend sends
  endDate?: string;
  location?: string;
  score?: string;
};

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  classId: string;
}

type EventColor = "green" | "blue" | "red"; // only these colors now
type CalEvent = { _id: string; label: string; color: EventColor };
type EventMap = Record<
  string, // date string like "2026-04-02"
  {
    event: EventTypea;
    color: EventColor;
  }[]
>;

// ─── Constants ─────────────────────────────
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
  green: "bg-green-500/20 text-green-400", // events
  blue: "bg-blue-500/20 text-blue-400", // assignments
  red: "bg-red-500/20 text-red-400", // exams
};

const getColorForEvent = (type: EventType): EventColor => {
  switch (type) {
    case "exam":
      return "red";
    case "assignment":
      return "blue";
    case "event":
      return "green";
    default:
      return "green"; // fallback
  }
};

// ─── Helpers ───────────────────────────────
const mapEventsByDate = (events: EventTypea[]) => {
  const map: Record<string, { event: EventTypea; color: EventColor }[]> = {};

  events.forEach((ev) => {
    if (!ev?.date) return;
    const dateKey = ev.date.split("T")[0];
    if (!map[dateKey]) map[dateKey] = [];
    map[dateKey].push({ event: ev, color: getColorForEvent(ev.type) });
  });

  return map;
};
function getDaysGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; currentMonth: boolean }[] = [];

  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + i + 1, currentMonth: false });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, currentMonth: true });
  for (let i = 1; i <= 42 - cells.length; i++)
    cells.push({ day: i, currentMonth: false });

  return cells;
}

// ─── Components ────────────────────────────
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
            key={ev._id}
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded truncate shrink-0 ${EVENT_STYLES[ev.color]}`}
          >
            {ev.label}
          </div>
        ))}
        {events.length > 2 && (
          <span className="text-[14px] text-gray-500 px-1.5">
            +{events.length - 2} more
          </span>
        )}
      </div>
    </div>
  );
}

const AddEventDialog = ({ open, onClose, classId }: AddEventDialogProps) => {
  // ─── Local state
  const [type, setType] = useState<EventType>("event");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [events, setEvents] = useState<EventMap>({});

  const [formData, setFormData] = useState({
    type: "event" as EventType,
    title: "",
    description: "",
    location: "",
    maxScore: 0,
    startDate: "",
    endDate: "",
  });

  const TYPE_OPTIONS: { value: EventType; label: string; icon: string }[] = [
    { value: "event", label: "Event", icon: "📅" },
    { value: "assignment", label: "Assignment", icon: "📝" },
    { value: "exam", label: "Exam", icon: "📋" },
  ];

  // ─── Handlers
  const handleChange =
    (key: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleCreateEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const res = await fetch("/api/teacher/class-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: classId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          date: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          score: formData.maxScore,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return console.error("Failed to create event:", errText);
      }

      toast.success("Event created successfully");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  // ─── JSX
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#13161d] p-6 rounded-2xl w-full max-w-md text-white">
        <h2 className="text-lg font-semibold mb-4">Add to Calendar</h2>

        <div className="flex gap-2 mb-3">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: opt.value }))
              }
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all border ${
                formData.type === opt.value
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <input
            placeholder="Title"
            value={formData.title}
            onChange={handleChange("title")}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={handleChange("description")}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white resize-none"
          />
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange("startDate")}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
          />
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange("endDate")}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white"
          />

          {(formData.type === "event" || formData.type === "exam") && (
            <input
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="Location"
            />
          )}

          {(formData.type === "assignment" || formData.type === "exam") && (
            <input
              value={formData.maxScore}
              onChange={handleChange("maxScore")}
              placeholder="Max score"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 rounded text-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-blue-500 rounded text-white"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────
export default function ClassCalendarPage() {
  const params = useParams();
  const classId = params.classId as string;

  if (!classId) return <div>Class ID not found</div>;

  const [openDialog, setOpenDialog] = useState(false);
  const now = new Date();
  const [current, setCurrent] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<EventMap>({});

  const { year, month } = current;
  const cells = getDaysGrid(year, month);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const res = await fetch(`/api/teacher/class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return console.error("Failed to fetch events");
        const data = await res.json();

        // Map events by date
        const eventsByDate = mapEventsByDate(data.events);

        // Update state
        setEvents(eventsByDate);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, [classId]);

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
      <Sidebar userRole="teacher" />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-6 py-4 bg-[#13161d] border-b border-white/[0.06] shrink-0">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-[22px] font-semibold tracking-tight">
              {MONTHS[month]}
            </h1>
            <span className="text-sm text-gray-500">{year}</span>
          </div>

          <div className="flex items-center gap-1.5">
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
            <AddEventDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              classId={classId}
            />
            <button
              onClick={() => setOpenDialog(true)}
              className="ml-1 px-3.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium transition-colors"
            >
              ＋ Event
            </button>
          </div>
        </div>

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
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`
              : null;

            const cellEvents: CalEvent[] = key
              ? (events[key]?.map((e) => ({
                  _id: e.event._id,
                  label: e.event.title,
                  color: e.color,
                })) ?? [])
              : [];

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
                events={cellEvents}
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

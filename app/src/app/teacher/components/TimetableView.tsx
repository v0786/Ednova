'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Clock,
  MapPin,
  Users,
  BookOpen,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  X,
  GripVertical,
} from 'lucide-react';
import {
  getTeacherSchedule,
  type TeacherScheduleEntry,
} from '@/lib/actions/timetableActions';

export interface TimetableViewProps {
  teacherId?: string;
}

interface ClassWithPosition extends TeacherScheduleEntry {
  top: number;
  height: number;
}

// Day configuration
const DAYS = [
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
];

// Subject color mapping
const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  Mathematics: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-300', hover: 'hover:bg-indigo-500/30' },
  Math: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-300', hover: 'hover:bg-indigo-500/30' },
  Science: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', hover: 'hover:bg-emerald-500/30' },
  Physics: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', hover: 'hover:bg-emerald-500/30' },
  Chemistry: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', hover: 'hover:bg-emerald-500/30' },
  Biology: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', hover: 'hover:bg-emerald-500/30' },
  English: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300', hover: 'hover:bg-blue-500/30' },
  'English Language': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300', hover: 'hover:bg-blue-500/30' },
  Literature: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300', hover: 'hover:bg-blue-500/30' },
  History: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300', hover: 'hover:bg-amber-500/30' },
  Geography: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-300', hover: 'hover:bg-cyan-500/30' },
  'Physical Education': { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-300', hover: 'hover:bg-rose-500/30' },
  PE: { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-300', hover: 'hover:bg-rose-500/30' },
  Art: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-300', hover: 'hover:bg-pink-500/30' },
  Music: { bg: 'bg-violet-500/20', border: 'border-violet-500/50', text: 'text-violet-300', hover: 'hover:bg-violet-500/30' },
  'Computer Science': { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-300', hover: 'hover:bg-sky-500/30' },
  Computing: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-300', hover: 'hover:bg-sky-500/30' },
  ICT: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-300', hover: 'hover:bg-sky-500/30' },
  'Foreign Language': { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' },
  Spanish: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' },
  French: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' },
  German: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' },
  Mandarin: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' },
  default: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-300', hover: 'hover:bg-slate-500/30' },
};

// Default schedule hours
const START_HOUR = 7; // 7 AM
const END_HOUR = 18; // 6 PM
const HOUR_HEIGHT = 64; // pixels per hour

/**
 * Converts time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Formats time for display (e.g., "08:00" -> "8:00 AM")
 */
function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Gets the current day of week (1=Mon, 7=Sun)
 */
function getCurrentDayOfWeek(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Gets subject color scheme
 */
function getSubjectColors(subject: string) {
  // Try exact match first
  if (SUBJECT_COLORS[subject]) {
    return SUBJECT_COLORS[subject];
  }
  // Try case-insensitive match
  const normalizedSubject = Object.keys(SUBJECT_COLORS).find(
    (key) => key.toLowerCase() === subject.toLowerCase()
  );
  return normalizedSubject ? SUBJECT_COLORS[normalizedSubject] : SUBJECT_COLORS.default;
}

/**
 * Calculate class block position and height
 */
function calculateClassPosition(
  entry: TeacherScheduleEntry,
  startHour: number,
  hourHeight: number
): { top: number; height: number } {
  const startMinutes = timeToMinutes(entry.startTime);
  const endMinutes = timeToMinutes(entry.endTime);
  const durationMinutes = endMinutes - startMinutes;

  const startOffsetMinutes = startMinutes - startHour * 60;
  const top = (startOffsetMinutes / 60) * hourHeight;
  const height = (durationMinutes / 60) * hourHeight;

  return { top, height };
}

export default function TimetableView({ teacherId }: TimetableViewProps) {
  const [schedule, setSchedule] = useState<TeacherScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<TeacherScheduleEntry | null>(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [draggedClass, setDraggedClass] = useState<TeacherScheduleEntry | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedDay, setSelectedDay] = useState(getCurrentDayOfWeek());

  // Update current time and check mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }, []);

  // Fetch schedule
  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      setError(null);

      try {
        const result = await getTeacherSchedule(teacherId);

        if (result.success) {
          setSchedule(result.data);
        } else {
          setError(result.error || 'Failed to load schedule');
          setSchedule([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [teacherId]);

  // Group schedule by day
  const scheduleByDay = useMemo(() => {
    const grouped: Record<number, ClassWithPosition[]> = {};
    DAYS.forEach((day) => {
      grouped[day.id] = [];
    });

    schedule.forEach((entry) => {
      const position = calculateClassPosition(entry, START_HOUR, HOUR_HEIGHT);
      if (grouped[entry.day]) {
        grouped[entry.day].push({ ...entry, ...position });
      }
    });

    // Sort by start time within each day
    Object.keys(grouped).forEach((dayId) => {
      grouped[Number(dayId)].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    });

    return grouped;
  }, [schedule]);

  // Calculate current time indicator position
  const currentTimePosition = useMemo(() => {
    const currentDay = getCurrentDayOfWeek();
    const minutesFromStart = currentTimeMinutes - START_HOUR * 60;
    const top = (minutesFromStart / 60) * HOUR_HEIGHT;
    return { top, currentDay };
  }, [currentTimeMinutes]);

  // Drag and drop handlers
  const handleDragStart = useCallback((entry: TeacherScheduleEntry) => {
    setDraggedClass(entry);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedClass(null);
  }, []);

  const handleDrop = useCallback(
    (targetDay: number, targetTime: string) => {
      if (draggedClass) {
        // Visual feedback only - actual update would be implemented here
        // This is a placeholder for future implementation
        void targetDay;
        void targetTime;
      }
      setDraggedClass(null);
    },
    [draggedClass]
  );

  // Modal handlers
  const openClassModal = useCallback((entry: TeacherScheduleEntry) => {
    setSelectedClass(entry);
  }, []);

  const closeClassModal = useCallback(() => {
    setSelectedClass(null);
  }, []);

  // Navigation handlers for mobile
  const goToPreviousDay = useCallback(() => {
    setSelectedDay((prev) => (prev === 1 ? 6 : prev - 1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDay((prev) => (prev === 6 ? 1 : prev + 1));
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Weekly Timetable</h2>
              <p className="text-xs text-slate-400">Loading your schedule...</p>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 animate-pulse">
                <div className="h-32 bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-white">Weekly Timetable</h2>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="py-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDay = getCurrentDayOfWeek();
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Weekly Timetable</h2>
              <p className="text-xs text-slate-400">
                {schedule.length} class{schedule.length !== 1 ? 'es' : ''} scheduled this week
              </p>
            </div>
          </div>

          {/* Mobile Day Selector */}
          {isMobileView && (
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                onClick={goToPreviousDay}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-white min-w-[100px] text-center">
                {DAYS.find((d) => d.id === selectedDay)?.name}
              </span>
              <button
                onClick={goToNextDay}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Content */}
      <div className="p-4 sm:p-5">
        {schedule.length === 0 ? (
          /* Empty State */
          <div className="py-10 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
            <CalendarX className="w-12 h-12 mx-auto mb-3 text-slate-600" aria-hidden="true" />
            <p className="text-sm font-medium">No classes scheduled this week</p>
            <p className="text-xs text-slate-500 mt-1">Your timetable is empty</p>
          </div>
        ) : (
          <>
            {/* Desktop Grid View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {/* Time column header */}
                    <div className="text-xs font-medium text-slate-500 text-center py-2">
                      Time
                    </div>
                    {DAYS.map((day) => (
                      <div
                        key={day.id}
                        className={`text-center py-2 rounded-lg ${
                          day.id === currentDay
                            ? 'bg-indigo-500/20 border border-indigo-500/30'
                            : 'bg-slate-950 border border-slate-800'
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            day.id === currentDay ? 'text-indigo-300' : 'text-slate-300'
                          }`}
                        >
                          {day.name}
                        </span>
                        {day.id === currentDay && (
                          <span className="ml-2 text-[10px] text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                            TODAY
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Timetable Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Time Slots Column */}
                    <div className="relative" style={{ height: totalHeight }}>
                      {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
                        const hour = START_HOUR + i;
                        const period = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour % 12 || 12;
                        return (
                          <div
                            key={hour}
                            className="absolute w-full text-xs text-slate-500 text-right pr-2 -translate-y-1/2"
                            style={{ top: i * HOUR_HEIGHT }}
                          >
                            {displayHour}:00 {period}
                          </div>
                        );
                      })}
                    </div>

                    {/* Day Columns */}
                    {DAYS.map((day) => (
                      <div
                        key={day.id}
                        className={`relative rounded-lg ${
                          day.id === currentDay
                            ? 'bg-indigo-950/10'
                            : 'bg-slate-950/50'
                        }`}
                        style={{ height: totalHeight }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const targetTime = e.dataTransfer.getData('text/time');
                          if (targetTime) {
                            handleDrop(day.id, targetTime);
                          }
                        }}
                      >
                        {/* Hour grid lines */}
                        {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                          <div
                            key={i}
                            className="absolute w-full border-t border-slate-800/50"
                            style={{ top: i * HOUR_HEIGHT }}
                          />
                        ))}

                        {/* Current time indicator */}
                        {day.id === currentTimePosition.currentDay &&
                          currentTimePosition.top >= 0 &&
                          currentTimePosition.top <= totalHeight && (
                            <div
                              className="absolute left-0 right-0 border-t-2 border-rose-500 z-20 pointer-events-none"
                              style={{ top: currentTimePosition.top }}
                            >
                              <span className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-rose-500" />
                            </div>
                          )}

                        {/* Class blocks */}
                        {scheduleByDay[day.id]?.map((classItem) => {
                          const colors = getSubjectColors(classItem.subject);
                          return (
                            <div
                              key={classItem.id}
                              draggable
                              onDragStart={() => handleDragStart(classItem)}
                              onDragEnd={handleDragEnd}
                              onClick={() => openClassModal(classItem)}
                              className={`absolute left-1 right-1 rounded-lg border p-2 cursor-pointer transition-all duration-200 group ${
                                colors.bg
                              } ${colors.border} ${colors.hover} ${
                                draggedClass?.id === classItem.id ? 'opacity-50' : ''
                              }`}
                              style={{
                                top: classItem.top,
                                height: Math.max(classItem.height - 4, 40),
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`${classItem.subject} at ${formatTime(
                                classItem.startTime
                              )}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  openClassModal(classItem);
                                }
                              }}
                            >
                              <div className="flex items-start gap-1">
                                <GripVertical className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-bold truncate ${colors.text}`}>
                                    {classItem.subject}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {classItem.grade} • {classItem.division}
                                  </p>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {formatTime(classItem.startTime)} -{' '}
                                    {formatTime(classItem.endTime)}
                                  </p>
                                  {classItem.room && (
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {classItem.room}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile List View */}
            <div className="lg:hidden">
              <div className="space-y-3">
                {scheduleByDay[selectedDay]?.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    <CalendarX className="w-10 h-10 mx-auto mb-3 text-slate-600" aria-hidden="true" />
                    <p className="text-sm">No classes scheduled</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {DAYS.find((d) => d.id === selectedDay)?.name} is free
                    </p>
                  </div>
                ) : (
                  scheduleByDay[selectedDay]
                    ?.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                    .map((classItem) => {
                      const colors = getSubjectColors(classItem.subject);
                      return (
                        <div
                          key={classItem.id}
                          onClick={() => openClassModal(classItem)}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            colors.bg
                          } ${colors.border} ${colors.hover}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${classItem.subject} at ${formatTime(classItem.startTime)}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              openClassModal(classItem);
                            }
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Time */}
                            <div className="flex flex-col items-center min-w-[70px] pt-1">
                              <span className="text-sm font-bold text-slate-200">
                                {formatTime(classItem.startTime)}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatTime(classItem.endTime)}
                              </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px self-stretch bg-slate-700" aria-hidden="true" />

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className={`w-4 h-4 ${colors.text}`} aria-hidden="true" />
                                <h3 className={`font-bold truncate ${colors.text}`}>
                                  {classItem.subject}
                                  {classItem.subjectCode && (
                                    <span className="text-slate-500 font-normal ml-2">
                                      ({classItem.subjectCode})
                                    </span>
                                  )}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                                <span className="truncate">
                                  {classItem.grade} • {classItem.division}
                                </span>
                              </div>

                              {classItem.room && (
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                                  <span>{classItem.room}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Day quick switch for mobile */}
              <div className="mt-4 flex items-center justify-center gap-1 flex-wrap">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      selectedDay === day.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    } ${day.id === currentDay ? 'ring-1 ring-indigo-500/50' : ''}`}
                  >
                    {day.short}
                    {day.id === currentDay && (
                      <span className="ml-1 text-[8px] text-indigo-300">T</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={closeClassModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="class-modal-title"
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`p-5 border-b border-slate-800 ${
                getSubjectColors(selectedClass.subject).bg
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3
                    id="class-modal-title"
                    className={`text-xl font-bold ${getSubjectColors(selectedClass.subject).text}`}
                  >
                    {selectedClass.subject}
                  </h3>
                  {selectedClass.subjectCode && (
                    <p className="text-sm text-slate-400 mt-1">
                      Code: {selectedClass.subjectCode}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeClassModal}
                  className="p-2 rounded-lg bg-slate-950/50 text-slate-400 hover:text-white transition"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Time</p>
                  <p className="text-white font-medium">
                    {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Period {selectedClass.periodNumber} •{' '}
                    {DAYS.find((d) => d.id === selectedClass.day)?.name}
                  </p>
                </div>
              </div>

              {/* Class */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Class</p>
                  <p className="text-white font-medium">
                    {selectedClass.grade} • {selectedClass.division}
                  </p>
                </div>
              </div>

              {/* Room */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="text-white font-medium">
                    {selectedClass.room || 'Room TBA'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <a
                  href="/admin/attendance"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium text-center hover:bg-indigo-500 transition"
                >
                  Take Attendance
                </a>
                <a
                  href="/admin/daily-academics"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 text-white text-sm font-medium text-center hover:bg-slate-700 transition"
                >
                  Lesson Log
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

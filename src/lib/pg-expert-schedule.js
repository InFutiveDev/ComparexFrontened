export const WEEKDAY_OPTIONS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "all-weekdays", label: "Mon–Fri (Weekdays)" },
  { value: "all-days", label: "All days (Mon–Sun)" },
];

export const WEEKDAY_LABELS = Object.fromEntries(
  WEEKDAY_OPTIONS.map((option) => [option.value, option.label]),
);

export function newWeeklyScheduleEntry() {
  return {
    id: `schedule-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    days: [],
    times: [""],
  };
}

export function formatWeeklyAvailability(schedules = []) {
  if (!Array.isArray(schedules) || schedules.length === 0) return "";

  return schedules
    .map((entry) => {
      const dayLabels = (entry.days || [])
        .map((day) => WEEKDAY_LABELS[day] || day)
        .join(", ");
      const times = (entry.times || []).map((time) => String(time).trim()).filter(Boolean).join(", ");
      if (!dayLabels) return "";
      return times ? `${dayLabels}: ${times}` : dayLabels;
    })
    .filter(Boolean)
    .join(" | ");
}

export function normalizeWeeklyAvailability(input) {
  if (!Array.isArray(input)) return [];

  return input
    .map((entry, index) => ({
      id: entry?.id || `schedule-${index + 1}`,
      days: Array.isArray(entry?.days)
        ? [...new Set(entry.days.map((day) => String(day).trim()).filter(Boolean))]
        : [],
      times: Array.isArray(entry?.times)
        ? entry.times.map((time) => String(time).trim()).filter(Boolean)
        : [],
    }))
    .filter((entry) => entry.days.length > 0 && entry.times.length > 0);
}

export function ensureWeeklyAvailability(expert) {
  if (Array.isArray(expert?.weeklyAvailability) && expert.weeklyAvailability.length > 0) {
    return expert.weeklyAvailability.map((entry) => ({
      ...entry,
      times: entry.times?.length ? entry.times : [""],
    }));
  }
  return [newWeeklyScheduleEntry()];
}

export function serializeWeeklyAvailability(schedules = []) {
  return normalizeWeeklyAvailability(schedules);
}

export function expertHasAvailability(expert) {
  if (!expert) return false;
  if (normalizeWeeklyAvailability(expert.weeklyAvailability).length > 0) return true;
  return Boolean(String(expert.availabilitySlots || "").trim());
}

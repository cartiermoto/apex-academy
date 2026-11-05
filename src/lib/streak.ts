/**
 * Study streak. A "study day" is a calendar day on which the student completed
 * at least one section (theory, quiz or exercise) of any sub-lesson. The streak
 * is how many such days in a row end today, or end yesterday while today is
 * still open: missing a whole day resets it.
 *
 * Days are the student's own local calendar days ("2026-11-05"), never UTC, so
 * "today" matches the clock on their wall.
 */

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Noon, not midnight: daylight-saving jumps can never push it to another day. */
function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

function shiftDay(key: string, by: number): string {
  const d = parseDay(key);
  d.setDate(d.getDate() + by);
  return dayKey(d);
}

export interface WeekDay {
  key: string;
  done: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface StreakInfo {
  /** days in a row, counting today if it is already done */
  current: number;
  best: number;
  total: number;
  doneToday: boolean;
  /** Monday to Sunday of the current week */
  week: WeekDay[];
}

export function computeStreak(days: readonly string[], now: Date = new Date()): StreakInfo {
  const set = new Set(days);
  const today = dayKey(now);
  const doneToday = set.has(today);

  // Today still open: the streak is alive as long as yesterday is done.
  let cursor = doneToday ? today : shiftDay(today, -1);
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor = shiftDay(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of [...set].sort()) {
    run = prev !== null && shiftDay(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }

  const sinceMonday = (now.getDay() + 6) % 7;
  const monday = shiftDay(today, -sinceMonday);
  const week: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const key = shiftDay(monday, i);
    return { key, done: set.has(key), isToday: key === today, isFuture: key > today };
  });

  return { current, best, total: set.size, doneToday, week };
}

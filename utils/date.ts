export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

export class Day {
  year: number;
  month: number;
  day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  static today(): Day {
    const today = new Date();
    return new Day(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }

  static from(date: Date): Day {
    return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  date(): Date {
    const date = new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0);
    date.setUTCDate(date.getDate());
    date.setUTCMonth(date.getMonth());
    date.setUTCFullYear(date.getFullYear());
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date;
  }

  toString(): string {
    const year = this.year.toString().padStart(2, "0");
    const month = this.month.toString().padStart(2, "0");
    const day = this.day.toString().padStart(2, "0");

    return `${year}-${month}-${day} 00:00:00`;
  }

  addDays(days: number) {
    const date = this.date();
    date.setDate(date.getUTCDate() + days);

    const next = Day.from(date);

    this.year = next.year;
    this.month = next.month;
    this.day = next.day;
  }
}

interface CalculateDueInParams {
  lastCompleteDate: string | null;
  createdOn: Date;
  today: Day;
  frequency: number;
}

/**
 * Calculates how many days until a habit is (or, since it was) due.
 *
 * This is based upon the last date that the habit was marked completed, if available.
 * If the habit is new (has had no completions yet), we base the due date off the creation
 * date of the habit itself.
 */
export function calculateDueIn({
  lastCompleteDate,
  createdOn,
  frequency,
  today,
}: CalculateDueInParams): number {
  const dueDate = lastCompleteDate ? new Date(lastCompleteDate) : new Date(createdOn);
  dueDate.setDate(dueDate.getDate() + frequency); 

  const due = Day.from(dueDate);

  return Math.floor(
    (due.date().getTime() - today.date().getTime()) /
      MILLIS_IN_DAY
  );
}

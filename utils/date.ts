export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

export function getTodayTimestamp(): number {
  return normalizeDate(new Date()).getTime();
}

export function normalizeDate(date: Date): Date {
  const newDate = new Date();
  newDate.setUTCDate(date.getDate());
  newDate.setUTCHours(0);
  newDate.setUTCMinutes(0);
  newDate.setUTCSeconds(0);
  newDate.setUTCMilliseconds(0);

  return newDate;
}

type DateLike = Date | string;

interface CalculateDueInParams {
  lastCompleteDate: DateLike | null;
  createdOn: DateLike;
  today: DateLike;
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
  // TODO: A lot of these `normalizeDate` calls are defensive... could probably be cleaned up.
  today = normalizeDate(new Date(today));

  const dueDate = normalizeDate(new Date());

  if (lastCompleteDate) {
    dueDate.setUTCDate(
      normalizeDate(new Date(lastCompleteDate)).getUTCDate() + frequency
    );
  } else {
    dueDate.setUTCDate(
      normalizeDate(new Date(createdOn)).getUTCDate() + frequency - 2
    );
  }

  return Math.floor((dueDate.getTime() - today.getTime()) / MILLIS_IN_DAY);
}

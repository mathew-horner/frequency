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

interface CalculateDueInParams {
  // TODO: This is actually a new type that is returned by a hyper specific SQL query...
  habit: any;
  today: Date;
}

/**
 * Calculates how many days until a habit is (or, since it was) due.
 *
 * This is based upon the last date that the habit was marked completed, if available.
 * If the habit is new (has had no completions yet), we base the due date off the creation
 * date of the habit itself.
 */
export function calculateDueIn({ habit, today }: CalculateDueInParams): number {
  const lastCompleteDate = habit.lastCompleteDate
    ? normalizeDate(new Date(habit.lastCompleteDate))
    : (() => {
        const due = new Date();
        due.setDate(habit.createdOn.getUTCDate() - 1);
        return normalizeDate(due);
      })();

  // TODO: Probably want to upgrade to using a more mature date library at some point...
  const dueDate = normalizeDate(new Date());
  dueDate.setUTCDate(lastCompleteDate.getUTCDate() + habit.frequency);

  const dueIn = Math.floor(
    (dueDate.getTime() - today.getTime()) / MILLIS_IN_DAY
  );

  return dueIn;
}

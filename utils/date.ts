import { Habit } from "@prisma/client";
import JustDate from "../utils/justDate";

export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

interface CalculateDueInParams {
  habit: Habit;
  today: JustDate;

  /** The last date that the habit was marked as Complete. */
  lastCompleteDate?: JustDate;
}

/**
 * Calculates how many days until a habit is (or, since it was) due.
 *
 * This is based upon the last date that the habit was marked completed, if available.
 * If the habit is new (has had no completions yet), we base the due date off the creation
 * date of the habit itself.
 */
export function calculateDueIn({
  habit,
  today,
  lastCompleteDate,
}: CalculateDueInParams): number {
  let dueDate;

  if (lastCompleteDate) {
    dueDate = lastCompleteDate;
    dueDate.addDays(habit.frequency);
  } else {
    dueDate = JustDate.fromJsDateUtc(habit.createdOn);
    dueDate.addDays(habit.frequency - 1);
  }

  return Math.floor(
    (dueDate.jsDateUtc().getTime() - today.jsDateUtc().getTime()) /
      MILLIS_IN_DAY
  );
}

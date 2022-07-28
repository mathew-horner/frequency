import { z } from "zod";
import { MILLIS_IN_DAY } from "./date";

export default class JustDate {
  year: number;
  month: number;
  day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  private static empty() {
    return new JustDate(0, 0, 0);
  }

  static today(): JustDate {
    const now = new Date();
    return new JustDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  static todayUtc(): JustDate {
    const now = new Date();
    return new JustDate(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getDate()
    );
  }

  static fromJsDate(jsDate: Date): JustDate {
    const date = JustDate.empty();
    date.assignDate(jsDate);
    return date;
  }

  static fromJsDateUtc(jsDate: Date): JustDate {
    const date = JustDate.empty();
    date.assignDateUtc(jsDate);
    return date;
  }

  jsDate(): Date {
    return new Date(this.year, this.month - 1, this.day, 0, 0, 0, 0);
  }

  jsDateUtc(): Date {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, 0, 0, 0, 0));
  }

  toString(): string {
    // TODO: Use date-fns here.
    const year = this.year.toString().padStart(4, "0");
    const month = this.month.toString().padStart(2, "0");
    const day = this.day.toString().padStart(2, "0");

    return `${year}-${month}-${day} 00:00:00`;
  }

  private assignDate(date: Date) {
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = date.getDate();
  }

  private assignDateUtc(date: Date) {
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
    this.day = date.getUTCDate();
  }

  addDays(days: number) {
    const date = this.jsDate();
    date.setDate(this.day + days);
    this.assignDate(date);
  }

  addMonths(months: number) {
    const date = this.jsDate();
    date.setMonth(this.month + months);
    this.assignDate(date);
  }

  addYears(years: number) {
    const date = this.jsDate();
    date.setFullYear(this.year + years);
    this.assignDate(date);
  }

  subtractDays(days: number) {
    this.addDays(-days);
  }

  subtractMonths(months: number) {
    this.addMonths(-months);
  }

  subtractYears(years: number) {
    this.addYears(-years);
  }

  daysSince(other: JustDate) {
    return Math.floor(
      (this.jsDateUtc().getTime() - other.jsDateUtc().getTime()) / MILLIS_IN_DAY
    );
  }
}

export const JustDateSchema = z.object({
  year: z.number().int(),
  month: z.number().int(),
  day: z.number().int(),
});

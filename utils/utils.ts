import type { Dayjs } from "dayjs";
import { startDate, nowSem } from "./constants";
import * as R from "remeda";
import { weekdaysDict, weekdayNumValue } from "./constants";
import { ICalWeekday } from "ical-generator";

export function startDatePerWeekday(
  beginDate: Dayjs,
  weekday: ICalWeekday,
): Dayjs {
  const beginWeekday = beginDate.day();
  const wdNum = weekdayNumValue[weekday];
  if (beginWeekday <= wdNum) {
    return beginDate.day(wdNum);
  }
  return beginDate.day(7 + wdNum);
}

export function closestStartDate(weekdays: ICalWeekday[]) {
  const dates: Dayjs[] = weekdays.map((wd) =>
    startDatePerWeekday(startDate[nowSem], wd),
  );
  let closestDate = dates[0];
  for (const date of dates) {
    // the earliest date is the closest date
    if (date.isBefore(closestDate, "day")) {
      closestDate = date;
    }
  }

  return closestDate;
}

export function convertWeekdays(weekdayString: string) {
  return weekdayString.split("-").map((wd) => weekdaysDict[wd]);
}

export function getHoursMinutes(timeString: string) {
  return {
    hours: Number(timeString.slice(0, 2)),
    minutes: Number(timeString.slice(-2)),
  };
}

export function isEventSameSubject(
  s1: IntermediateEventData,
  s2: IntermediateEventData,
): boolean {
  const s1_no_time = R.omit(s1, ["start", "end", "weekdays"]);
  const s2_no_time = R.omit(s2, ["start", "end", "weekdays"]);
  return R.isDeepEqual(s1_no_time, s2_no_time);
}

export function isEventSameSubjectSameTime(
  s1: IntermediateEventData,
  s2: IntermediateEventData,
): boolean {
  return (
    isEventSameSubject(s1, s2) &&
    s1.start.isSame(s2.start, "minute") &&
    s1.end.isSame(s2.end, "minute")
  );
}

export function setEventToClosestStartDate(
  event: IntermediateEventData,
): IntermediateEventData {
  const closestDate: Dayjs = closestStartDate(event.weekdays);
  const newStart = event.start
    .month(closestDate.month())
    .date(closestDate.date())
    .year(closestDate.year());
  const newEnd = event.end
    .month(closestDate.month())
    .date(closestDate.date())
    .year(closestDate.year());
  return { ...event, start: newStart, end: newEnd };
}

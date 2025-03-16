import type { Dayjs } from "dayjs";
import { startDate, nowSem } from "./constants";

import { weekdaysDict } from "./constants";
import { ICalWeekday } from "ical-generator";

export function closestStartDate(weekdays: ICalWeekday[]) {
  const dates: Dayjs[] = weekdays.map((wd) => startDate[nowSem][wd]);
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

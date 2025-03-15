import type { Dayjs } from "dayjs";
import { closestStartDate, convertWeekdays, getHoursMinutes } from "./utils";
import { ICalCalendar, ICalEventRepeatingFreq, ICalRepeatingOptions, ICalWeekday } from "ical-generator";
import { endDate, nowSem } from "./constants";

export interface IntermediateEventData {
  prof?: string,
  section?: string,
  subject?: string,
  location: string,
  weekdays: ICalWeekday[],
  start: Dayjs,
  end: Dayjs,
}



function weekdayStartFromPrefix(prefix: string): {
  weekdays: ICalWeekday[],
  start: Dayjs,
  end: Dayjs,
} {
  const [weekdayString, timeStr] = prefix.split(' ');
  const [timeStartStr, timeEndStr] = timeStr.split('-');

  const weekdays = convertWeekdays(weekdayString);
  const timeStart = getHoursMinutes(timeStartStr);
  const timeEnd = getHoursMinutes(timeEndStr);

  const day = closestStartDate(weekdays);
  const start = day.hour(timeStart.hours).minute(timeStart.minutes);
  const end = day.hour(timeEnd.hours).minute(timeEnd.minutes);
  return { start, end, weekdays, };
}

export function parseIntermediateEventData(eventDetails: string): IntermediateEventData[] {
  /* eventDetails has the format
   * (weekdays) (time)/(location)
   * or in the case of subjects with multiple schedules:
   * (weekdays) (time);(events);(location)
   */


  const parts = eventDetails.split(';');
  if (parts.length == 1) {
    // There is only one event
    const event = parts[0];
    const [prefix, location] = event.split('/');
    const weekdayStart = weekdayStartFromPrefix(prefix);

    return [{ location, ...weekdayStart }];
  } else {
    // Multiple events in one string
    const prefix = parts[0];
    const weekdayStart = weekdayStartFromPrefix(prefix);

    const location = parts[parts.length - 1];
    const rest = parts.slice(1, -1);

    const firstEvent: IntermediateEventData = { location, ...weekdayStart };
    const restEvents = rest.flatMap(parseIntermediateEventData);

    return [firstEvent, ...restEvents];
  }
}

export function intermediateEventDatatoIcalEvent(prof: string, subject: string, calendar: ICalCalendar, eventData: IntermediateEventData) {
  const repeating: ICalRepeatingOptions = {
    byDay: eventData.weekdays, freq: ICalEventRepeatingFreq.WEEKLY, until: endDate[nowSem]
  };
  const icalEvent = calendar.createEvent({
    start: eventData.start,
    end: eventData.end,
    repeating,
    location: eventData.location,
    summary: subject,
    description: prof,
  });
  return icalEvent;
}

function eventCellTextToIntermediateEventData(cell: string, weekday: ICalWeekday, start: Dayjs, end: Dayjs): IntermediateEventData {
  /**
   * SAMPLE TEXT:
   * "PHYS 160\nAW CTC 506 (FULLY ONSITE)"
   */

  const [subject, rest] = cell.split('\n');
  const [section, location, _] = rest.split(' ');
  return {
    subject,
    section,
    location,
    weekdays: [weekday],
    start,
    end
  }
}

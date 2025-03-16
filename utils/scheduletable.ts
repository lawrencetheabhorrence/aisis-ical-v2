import { ICalWeekday } from "ical-generator";
import type { IntermediateEventData } from "./parse";
import * as R from "remeda";
import { closestStartDate } from "./utils";
import { Dayjs } from "dayjs";

export type EventColumn = IntermediateEventData[];
export type ScheduleTable = Record<ICalWeekday, EventColumn>;

export function mergeSubjectByWeekday(
  events: IntermediateEventData[],
): IntermediateEventData {
  if (events.length < 1) {
    throw Error("No events passed to this function!");
  }

  const checkedEvent = events[0];
  let weekendsNew: Set<ICalWeekday> = new Set<ICalWeekday>();
  for (const event of events) {
    if (!isEventSameSubjectSameTime(event, checkedEvent)) {
      throw Error("Not all events are the same subject");
    }
    weekendsNew = weekendsNew.union(new Set(event.weekdays));
  }

  return { ...checkedEvent, weekdays: Array.from(weekendsNew) };
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

export function mergeCellsInColumn(cells: EventColumn): EventColumn {
  let merged: EventColumn = [];

  function connectTwoEventsByTime(
    s1: IntermediateEventData,
    s2: IntermediateEventData,
  ): IntermediateEventData {
    if (!isEventSameSubject(s1, s2)) {
      throw new Error("Events are not the same subject");
    }

    if (s1.start.isAfter(s2.start, "minute")) {
      return connectTwoEventsByTime(s2, s1);
    }

    if (!s1.end.isSame(s2.start, "minute")) {
      throw new Error("These two events do not connect.");
    }

    const result = { ...s1 };
    result.end = s2.end;
    return { ...s1, end: s2.end };
  }

  let currentEvent = cells[0];

  for (let i = 1; i < cells.length; ++i) {
    try {
      currentEvent = connectTwoEventsByTime(currentEvent, cells[i]);
    } catch (error) {
      merged.push(currentEvent);
      currentEvent = cells[i];
    }
  }

  merged.push(currentEvent);
  return merged;
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

export function simplifySchedule(
  schedule: ScheduleTable,
): IntermediateEventData[] {
  const simplifiedColumns = R.mapValues(schedule, (v) =>
    v.length > 0 ? mergeCellsInColumn(v) : [],
  );
  const allEvents: IntermediateEventData[] = R.values(simplifiedColumns).flat();
  const groupedEvents = R.groupBy(
    allEvents,
    (e: IntermediateEventData) => `${e.subject} ${e.section} ${e.location}`,
  );

  const simplifiedByWeekday = R.mapValues(groupedEvents, mergeSubjectByWeekday);

  return R.values(simplifiedByWeekday).flat().map(setEventToClosestStartDate);
}

import { ICalWeekday } from "ical-generator";
import type { IntermediateEventData } from "./parse";
import { isEventSameSubjectSameTime, isEventSameSubject } from "./utils";
import * as R from "remeda";

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

export function mergeCellsInColumn(cells: EventColumn): EventColumn {
  const merged: EventColumn = [];

  function connectTwoEventsByTime(
    s1: IntermediateEventData,
    s2: IntermediateEventData,
  ): IntermediateEventData {
    if (s1.start.isAfter(s2.start, "minute")) {
      return connectTwoEventsByTime(s2, s1);
    }

    const result = { ...s1 };
    result.end = s2.end;
    return { ...s1, end: s2.end };
  }

  function isConnecting(s1: IntermediateEventData, s2: IntermediateEventData) {
    return (
      s1.end.isSame(s2.start, "minute") || s2.end.isSame(s1.start, "minute")
    );
  }

  let currentEvent = cells[0];

  for (let i = 1; i < cells.length; ++i) {
    if (
      !isEventSameSubject(currentEvent, cells[i]) ||
      !isConnecting(currentEvent, cells[i])
    )
      break;

    currentEvent = connectTwoEventsByTime(currentEvent, cells[i]);
  }

  merged.push(currentEvent);
  return merged;
}

export function simplifySchedule(
  schedule: ScheduleTable,
): IntermediateEventData[] {
  const simplifiedColumns = R.mapValues(schedule, (v: EventColumn) =>
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

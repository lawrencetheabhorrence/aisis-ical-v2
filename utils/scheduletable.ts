import type { ICalWeekday } from "ical-generator";
import type { IntermediateEventData } from "./parse";
import * as R from "remeda";

export type EventColumn = IntermediateEventData[];
export type ScheduleTable = Record<ICalWeekday, EventColumn>;

export function mergeCellsInColumn(cells: EventColumn): EventColumn {
  let merged: EventColumn = [];

  function connectTwoEventsByTime(s1: IntermediateEventData, s2: IntermediateEventData): IntermediateEventData {
    for (const prop in s1) {
      if (prop == 'start' || prop == 'end') {
        continue;
      }
      if ((s1 as any)[prop] !== (s2 as any)[prop]) {
        throw new Error('Events are not the same subject');
      }
    }

    /*
    if (s1.start.isAfter(s2.start, 'minute')) {
      return connectTwoEventsByTime(s2, s1);
    }
    */

    if (!s1.end.isSame(s2.start, "minute")) {
      throw new Error('These two events do not connect.');
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

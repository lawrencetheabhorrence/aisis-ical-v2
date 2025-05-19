import { Dayjs } from "dayjs";
import { ICalWeekday } from "ical-generator";

export interface IntermediateEventData {
  prof?: string;
  section?: string;
  subject?: string;
  location: string;
  weekdays: ICalWeekday[];
  start: Dayjs;
  end: Dayjs;
}

export type EventColumn = IntermediateEventData[];
export type ScheduleTable = Record<ICalWeekday, EventColumn>;

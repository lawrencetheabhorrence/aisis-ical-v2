import { ICalWeekday } from "ical-generator";
import dayjs from "./dayjs";
import { Dayjs } from "dayjs";
import nowCal from "@/scripts/json/now-sem-dates.json";
import nextCal from "@/scripts/json/next-sem-dates.json";

interface SemDate {
  [semKey: string]: Dayjs
}

function getEndDates() {
  const endDates: SemDate = {};
  for (const sem of nowCal) {
    endDates[sem["Semester"]] = dayjs(sem["End"]);
  }
  for (const sem of nextCal) {
    endDates[sem["Semester"]] = dayjs(sem["End"]);
  }
  return endDates;
}

function getStartDates() {
  const startDates: SemDate = {};
  for (const sem of nowCal) {
    startDates[sem["Semester"]] = dayjs(sem["Start"]);
  }
  for (const sem of nextCal) {
    startDates[sem["Semester"]] = dayjs(sem["Start"]);
  }
  return startDates;
}

export const endDate: SemDate = getEndDates();
export const nextSem = "2026-0";
export const nowSem = "2025-2";

export const weekdayNumValue: Record<ICalWeekday, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

export const startDate: SemDate = getStartDates();

export const weekdaysDict: Record<string, ICalWeekday> = {
  M: ICalWeekday.MO,
  T: ICalWeekday.TU,
  W: ICalWeekday.WE,
  TH: ICalWeekday.TH,
  F: ICalWeekday.FR,
  S: ICalWeekday.SA,
};

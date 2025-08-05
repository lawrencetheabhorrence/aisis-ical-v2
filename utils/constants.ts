import { ICalWeekday } from "ical-generator";
import dayjs from "./dayjs";
import { Dayjs } from "dayjs";

export const endDate: Record<string, Dayjs> = {
  "2024-0": dayjs("20240720"),
  "2024-1": dayjs("20241128"),
  "2024-2": dayjs("20250524"),
  "2025-0": dayjs("20250719"),
  "2025-1": dayjs("20251210"),
  "2025-2": dayjs("20260523"),
};
export const nextSem = "2025-2";
export const nowSem = "2025-1";

export const weekdayNumValue: Record<ICalWeekday, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

export const startDate: Record<string, Dayjs> = {
  "2024-0": dayjs("2024-06-05"),
  "2024-1": dayjs("2024-08-07"),
  "2024-2": dayjs("2025-01-15"),
  "2025-0": dayjs("2025-06-09"),
  "2025-1": dayjs("2025-05-08"),
  "2025-2": dayjs("2026-01-12"),
};

export const weekdaysDict: Record<string, ICalWeekday> = {
  M: ICalWeekday.MO,
  T: ICalWeekday.TU,
  W: ICalWeekday.WE,
  TH: ICalWeekday.TH,
  F: ICalWeekday.FR,
  S: ICalWeekday.SA,
};

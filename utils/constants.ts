import { ICalWeekday } from "ical-generator";
import dayjs from "./dayjs";
import type { Dayjs } from "dayjs";

export const endDate: Record<string, Dayjs> = {
  "2024-0": dayjs("20240720"),
  "2024-1": dayjs("20241128"),
  "2024-2": dayjs("20250524"),
};
export const nextSem = "2025-0";
export const nowSem = "2024-2";

export const startDate: Record<string, Record<ICalWeekday, Dayjs>> = {
  "2024-0": {
    SU: dayjs(),
    MO: dayjs("2024-06-10"),
    TU: dayjs("2024-06-11"),
    WE: dayjs("2024-06-05"),
    TH: dayjs("2024-06-06"),
    FR: dayjs("2024-06-07"),
    SA: dayjs("2024-06-08"),
  },
  "2024-1": {
    SU: dayjs(),
    MO: dayjs("2024-08-12"),
    TU: dayjs("2024-08-13"),
    WE: dayjs("2024-08-07"),
    TH: dayjs("2024-08-08"),
    FR: dayjs("2024-08-09"),
    SA: dayjs("2024-08-10"),
  },
  "2024-2": {
    SU: dayjs(),
    MO: dayjs("2025-01-20"),
    TU: dayjs("2025-01-21"),
    WE: dayjs("2025-01-15"),
    TH: dayjs("2025-01-16"),
    FR: dayjs("2025-01-17"),
    SA: dayjs("2025-01-18"),
  },
};

export const weekdaysDict: Record<string, ICalWeekday> = {
  M: ICalWeekday.MO,
  T: ICalWeekday.TU,
  W: ICalWeekday.WE,
  TH: ICalWeekday.TH,
  F: ICalWeekday.FR,
  S: ICalWeekday.SA,
};

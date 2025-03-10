import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const startDate: Record<string, Record<string, Dayjs>> = {
  "2024-0": {
    'MO': dayjs('20240610'),
    'TU': dayjs('20240611'),
    'WE': dayjs('20240605'),
    'TH': dayjs('20240606'),
    'FR': dayjs('20240607'),
    'SA': dayjs('20240608')
  },
  "2024-1": {
    'MO': dayjs('20240812'),
    'TU': dayjs('20240813'),
    'WE': dayjs('20240807'),
    'TH': dayjs('20240808'),
    'FR': dayjs('20240809'),
    'SA': dayjs('20240810')
  },
  "2024-2": {
    'MO': dayjs('20250120'),
    'TU': dayjs('20250121'),
    'WE': dayjs('20250115'),
    'TH': dayjs('20250116'),
    'FR': dayjs('20250117'),
    'SA': dayjs('20250118'),
  }
}

export const endDate: Record<string, Dayjs> = { '2024-0': dayjs('20240720'), '2024-1': dayjs('20241128'), '2024-2': dayjs('20250524') };
export const nextSem = "2025-0";
export const nowSem = "2024-2";

export type WeekdayLiteral = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
export const weekdaysDict: Record<string, WeekdayLiteral> = {
  'M': 'MO',
  'T': 'TU',
  'W': 'WE',
  'TH': 'TH',
  'F': 'FR',
  'S': 'SA'
};

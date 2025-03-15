import { expect, test } from 'vitest'
import type { IntermediateEventData } from '@/utils/parse';
import { parseIntermediateEventData } from '../utils/parse';
import dayjs from '../utils/dayjs';
import { ICalWeekday } from 'ical-generator';

test('parse one event', () => {
  const testString = 'M-TH 1230-1400/CTC 218'; // CSCI 40 <3
  const result: IntermediateEventData = parseIntermediateEventData(testString)[0];
  const correctStart = dayjs('2025-01-16 12:30');
  expect(result.weekdays).toEqual(['MO', 'TH']);
  expect(result.location).toEqual('CTC 218');
  expect(correctStart.isSame(result.start)).toBe(true);
});

test('parse event cell text', () => {
  const sampleText = "PHYS 160\nAW CTC 506 (FULLY ONSITE)";
  const result = eventCellTextToIntermediateEventData(sampleText, ICalWeekday.MO, dayjs(), dayjs());

  expect(result.subject).toBe("PHYS 160");
  expect(result.section).toBe("AW");
  expect(result.location).toBe("CTC 506");
})

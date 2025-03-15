import { expect, test } from 'vitest'
import { isEventSameSubject, isEventSameSubjectSameTime, mergeCellsInColumn, mergeSubjectByWeekday, type EventColumn } from "../utils/scheduletable";
import { ICalWeekday } from 'ical-generator';
import dayjs from '../utils/dayjs';
import { IntermediateEventData } from '@/utils/parse';

const phys: IntermediateEventData = {
  section: 'AW',
  subject: 'PHYS 160',
  location: 'CTC 506',
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(8).minute(0),
  end: dayjs().hour(8).minute(30)
};

const phys2 = { ...phys };
phys2.start = dayjs().hour(8).minute(30);
phys2.end = dayjs().hour(9).minute(0);
const phys3 = { ...phys };
phys3.start = dayjs().hour(9).minute(0);
phys3.end = dayjs().hour(9).minute(30);

const csci: IntermediateEventData = {
  section: 'D',
  subject: 'CSCI 40',
  location: 'CTC 215',
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(12).minute(30),
  end: dayjs().hour(13).minute(0),
};

const csci2 = { ...csci };
csci2.start = dayjs().hour(13).minute(0);
csci2.end = csci2.start.add(30, 'minute');
const csci3 = { ...csci };
csci3.start = dayjs().hour(13).minute(30);
csci3.end = csci2.start.add(30, 'minute');

const jpn: IntermediateEventData = {
  section: 'E1',
  subject: 'JPN 11',
  location: 'CTC 308',
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(14).minute(0),
  end: dayjs().hour(14).minute(30),
};

const jpn2 = { ...jpn };
jpn2.start = dayjs().hour(14).minute(30);
jpn2.end = jpn2.start.add(30, 'minute');
const jpn3 = { ...jpn };
jpn3.start = dayjs().hour(15).minute(0);
jpn3.end = jpn2.start.add(30, 'minute');

const pe: IntermediateEventData = {
  section: 'PHY-G',
  subject: 'PHYED 122',
  location: 'TAB TEN AREA',
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(16).minute(30),
  end: dayjs().hour(17).minute(0),
};

const pe2 = { ...pe };
pe2.start = dayjs().hour(17).minute(0);
pe2.end = pe2.start.add(30, 'minute');

test('merge one subject', () => {
  const subjects: EventColumn = [phys, phys2, phys3];
  const result = mergeCellsInColumn(subjects);

  expect(result).toHaveLength(1);

  const physMerged: IntermediateEventData = result[0];
  expect(physMerged.start.isSame(dayjs().hour(8).minute(0), "minute")).toBe(true);
  expect(physMerged.end.isSame(dayjs().hour(9).minute(30), "minute")).toBe(true);
});

test('merge Monday schedule', () => {
  const subjects = [phys, phys2, phys3, csci, csci2, csci3, jpn, jpn2, jpn3, pe, pe2];

  const result = mergeCellsInColumn(subjects);
  expect(result).toHaveLength(4);
});

test('merge subject by weekday', () => {
  const physWed: IntermediateEventData = { ...phys, weekdays: [ICalWeekday.TH] };
  const physMerged = mergeSubjectByWeekday([phys, physWed]);

  expect(physMerged.weekdays).toHaveLength(2);
  expect(physMerged.weekdays).toContain(ICalWeekday.MO);
  expect(physMerged.weekdays).toContain(ICalWeekday.TH);
});

test('is event same subject', () => {
  const result = isEventSameSubject(phys, phys2);
  expect(result).toBe(true);

  const wrongResult = isEventSameSubject(phys, csci);
  expect(wrongResult).toBe(false);
});

test('is event same subject same time', () => {
  const resultDifferentTime = isEventSameSubjectSameTime(phys, phys2);
  expect(resultDifferentTime).toBe(false);
  const correctResult = isEventSameSubjectSameTime(phys, phys);
  expect(correctResult).toBe(true);
});

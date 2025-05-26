import { expect, test } from "vitest";
import {
  closestStartDate,
  isEventSameSubject,
  isEventSameSubjectSameTime,
  startDatePerWeekday,
} from "../utils/utils";
import { ICalWeekday } from "ical-generator";
import { startDate, nowSem } from "../utils/constants";

const phys: IntermediateEventData = {
  section: "AW",
  subject: "PHYS 160",
  location: "CTC 506",
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(8).minute(0),
  end: dayjs().hour(8).minute(30),
};

const phys2 = { ...phys };
phys2.start = phys.end;
phys2.end = phys2.start.add(30, "minute");

const phys3 = { ...phys2 };
phys3.start = phys2.end;
phys3.end = phys3.start.add(30, "minute");

const csci: IntermediateEventData = {
  section: "D",
  subject: "CSCI 40",
  location: "CTC 215",
  weekdays: [ICalWeekday.MO],
  start: dayjs().hour(12).minute(30),
  end: dayjs().hour(13).minute(0),
};

test("Start date per weekday should give the closest date to the given start date that falls on that weekday", () => {
  expect(
    startDatePerWeekday(dayjs("2024-06-05"), ICalWeekday.MO).isSame(
      dayjs("2024-06-10"),
    ),
  ).toBe(true);
});

test("Closest start date should choose the earliest day within the given weekdays", () => {
  expect(closestStartDate([ICalWeekday.MO, ICalWeekday.FR]).day()).toBe(5);
  expect(closestStartDate([ICalWeekday.MO, ICalWeekday.TH]).day()).toBe(4);
});

test("is event same subject", () => {
  const result = isEventSameSubject(phys, phys2);
  expect(result).toBe(true);

  const wrongResult = isEventSameSubject(phys, csci);
  expect(wrongResult).toBe(false);
});

test("is event same subject same time", () => {
  const resultDifferentTime = isEventSameSubjectSameTime(phys, phys2);
  expect(resultDifferentTime).toBe(false);
  const correctResult = isEventSameSubjectSameTime(phys, phys);
  expect(correctResult).toBe(true);
});

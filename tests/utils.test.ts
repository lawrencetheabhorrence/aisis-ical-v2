import { expect, test } from "vitest";
import {
  closestStartDate,
  isEventSameSubject,
  isEventSameSubjectSameTime,
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

test("Closest start date should choose the earliest day within the given weekdays", () => {
  expect(closestStartDate([ICalWeekday.MO, ICalWeekday.FR])).toBe(
    startDate[nowSem]["FR"],
  );
  expect(closestStartDate([ICalWeekday.MO, ICalWeekday.TH])).toBe(
    startDate[nowSem]["TH"],
  );
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

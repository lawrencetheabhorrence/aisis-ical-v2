import { expect, test } from "vitest";
import type { IntermediateEventData } from "@/utils/types";
import { parseIntermediateEventData } from "../utils/parse";
import dayjs from "../utils/dayjs";
import { ICalWeekday } from "ical-generator";

test("parse one event", () => {
  const testString = "M-TH 1230-1400/CTC 218"; // CSCI 40 <3
  const result: IntermediateEventData =
    parseIntermediateEventData(testString)[0];
  const correctStart = closestStartDate(
    [ICalWeekday.MO, ICalWeekday.TH],
    nowSem,
  )
    .hour(12)
    .minute(30);
  expect(result.weekdays).toEqual(["MO", "TH"]);
  expect(result.location).toEqual("CTC 218");
  expect(correctStart.isSame(result.start)).toBe(true);
});

test("parse event cell text", () => {
  const sampleText = "PHYS 160\nAW CTC 506 (FULLY ONSITE)";
  const sampleText2 = "MATH 51.4\nST1B SEC-A209 (FULLY ONSITE)";
  const result = eventCellTextToIntermediateEventData(
    sampleText,
    ICalWeekday.MO,
    dayjs(),
    dayjs(),
  );

  expect(result.subject).toBe("PHYS 160");
  expect(result.section).toBe("AW");
  expect(result.location).toBe("CTC 506");

  const result2 = eventCellTextToIntermediateEventData(
    sampleText2,
    ICalWeekday.MO,
    dayjs(),
    dayjs(),
  );
  expect(result2.subject).toBe("MATH 51.4");
  expect(result2.section).toBe("ST1B");
  expect(result2.location).toBe("SEC-A209");
});

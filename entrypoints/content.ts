import {
  eventCellTextToIntermediateEventData,
  IntermediateEventData,
  intermediateEventDatatoIcalEvent,
} from "@/utils/parse";
import { ScheduleTable, simplifySchedule } from "@/utils/scheduletable";
import dayjs from "dayjs";
import ical, { ICalCalendar, ICalEvent, ICalWeekday } from "ical-generator";

function getTimeFromRow(row: number) {
  const dummyStart = dayjs("2025-01-01").hour(7).minute(0);
  const dummyEnd = dummyStart.add(30, "minute");
  return {
    start: dummyStart.add(30 * (row - 1), "minute"),
    end: dummyEnd.add(30 * (row - 1), "minute"),
  };
}

function createCalButton(calendar: ICalCalendar) {
  const calLink = document.createElement("a");
  calLink.classList.add("button01");

  calLink.style.textDecoration = "none";
  calLink.style.paddingInline = "6px";
  calLink.style.paddingBlock = "1px";
  calLink.style.border = "2px solid buttonborder";
  calLink.style.display = "block";
  calLink.style.width = "max-content";

  calLink.textContent = "Export to Calendar";
  calLink.setAttribute(
    "href",
    "data:text/calendar;charset=utf8," +
    encodeURIComponent(calendar.toString()),
  );
  calLink.setAttribute("download", "class_schedule.ics");

  return calLink;
}

const weekdays = [
  ICalWeekday.MO,
  ICalWeekday.TU,
  ICalWeekday.WE,
  ICalWeekday.TH,
  ICalWeekday.FR,
  ICalWeekday.SA,
];

export default defineContentScript({
  matches: [
    "*://aisis.ateneo.edu/j_aisis/confirmEnlistment.do",
    "*://aisis.ateneo.edu/j_aisis/J_VMCS.do",
  ],
  main() {
    // My Class Schedule
    if (window.location.href === "https://aisis.ateneo.edu/j_aisis/J_VMCS.do") {
      const schedtable: HTMLTableElement | null =
        document.querySelector('[width="90%"]');
      if (schedtable) {
        const tableBody = schedtable.tBodies[0];
        const rows: HTMLCollectionOf<HTMLTableRowElement> =
          tableBody.getElementsByTagName("tr");
        const sched: ScheduleTable = {
          SU: [],
          MO: [],
          TU: [],
          WE: [],
          TH: [],
          FR: [],
          SA: [],
        };

        function getTextByRowCol(row: number, col: number) {
          const cell = rows[row].getElementsByTagName("td")[col];
          return cell.innerText;
        }

        for (let row = 1; row < rows.length; ++row) {
          for (let col = 1; col < 7; ++col) {
            const content = getTextByRowCol(row, col).trim();
            if (content.length <= 0) {
              continue;
            }
            const time = getTimeFromRow(row);
            const eventData = eventCellTextToIntermediateEventData(
              content,
              weekdays[col - 1],
              time.start,
              time.end,
            );

            sched[weekdays[col - 1]].push(eventData);
          }
        }

        const simplifiedEventDatas: IntermediateEventData[] =
          simplifySchedule(sched);

        const calendar = ical();

        const events: ICalEvent[] = [];
        for (const eventData of simplifiedEventDatas) {
          const subject =
            eventData.subject === undefined ? "" : eventData.subject;
          events.push(
            intermediateEventDatatoIcalEvent("", subject, calendar, eventData),
          );
        }

        const button = createCalButton(calendar);
        const buttonTd = document.createElement("td");
        buttonTd.appendChild(button);
        const printButtonTd = document.querySelector("td > input[value='Printer Friendly Version']").parentElement;
        if (printButtonTd) {
          printButtonTd.insertAdjacentElement("afterend", buttonTd);
        }
      }
    }
  },
});

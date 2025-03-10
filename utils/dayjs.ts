import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from 'dayjs/plugin/timezone';

// https://stackoverflow.com/questions/68715540/dayjs-is-in-the-wrong-timezone

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Manila");

function timezonedDayjs(...args: any[]) {
  return dayjs(...args).tz();
}

function timezonedUnix(value: number) {
  return dayjs.unix(value).tz();
}

timezonedDayjs.unix = timezonedUnix;

export default timezonedDayjs;

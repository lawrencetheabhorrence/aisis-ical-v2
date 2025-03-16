import dayjs from "dayjs";
export default defineContentScript({
  matches: ["*://*.google.com/*"],
  main() {
    console.log("Hello content.");
    console.log(dayjs());
  },
});

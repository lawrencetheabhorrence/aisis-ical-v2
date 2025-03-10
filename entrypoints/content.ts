import dayjs from "dayjs";
export default defineContentScript({
  matches: ['*://aisis.ateneo.edu/j_aisis/confirmEnlistment.do', '*://aisis.ateneo.edu/j_aisis/J_VMCS.do'],
  main() {
    console.log('Hello content.');
    console.log(dayjs());
  },
});

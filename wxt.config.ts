import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "aisis-ical@aisis-ical.com"
      }
    }
  }
});

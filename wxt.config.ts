import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "71ae5478-5e00-4f3d-8b68-bd76bf5aeebc",
      },
    },
  },
});

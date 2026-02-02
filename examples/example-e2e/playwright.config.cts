/* eslint-disable import/no-extraneous-dependencies */
import { workspaceRoot } from "@nx/devkit"
import { nxE2EPreset } from "@nx/playwright/preset"
import { defineConfig, devices } from "@playwright/test"

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env["BASE_URL"] || "http://localhost:4300"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: "./src" }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npx nx run example:preview",
    url: "http://localhost:4300",
    reuseExistingServer: !process.env["CI"],
    cwd: workspaceRoot,
    env: {
      VITE_AUTH_BASE: "http://localhost:34433",
      VITE_MAILPIT_URL: "http://localhost:8025",
      VITE_SHOW_DEV_TOOLS: "false",
    },
  },
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})

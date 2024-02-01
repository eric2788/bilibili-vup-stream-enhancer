import { defineConfig, devices } from '@playwright/test';
import type { GlobalOptions } from '@tests/options';
import { envBool, envInt } from '@tests/utils/misc';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' })

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<GlobalOptions>({
  timeout: 120000,
  globalTimeout: 3600 * 3600 * 1,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['github'],
    ['list', { printSteps: true }],
    ['html', { open: 'never' }]
  ] : [['list', { printSteps: true }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-all-retries',
    screenshot: 'on',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'edge-theme',
      use: { ...devices['Desktop Edge'], channel: 'msedge', isThemeRoom: true },
    },
    {
      name: 'chrome-theme',
      use: { ...devices['Desktop Chrome'], channel: 'chrome', isThemeRoom: true },
    },
    {
      name: 'chromium-theme',
      use: { ...devices['Desktop Chrome'], isThemeRoom: true },
    },
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'], channel: 'chrome',
        roomId: envInt('ROOM_ID'),
        isThemeRoom: envBool('IS_THEME_ROOM'),
        maxPage: envInt('MAX_PAGE'),
      }
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
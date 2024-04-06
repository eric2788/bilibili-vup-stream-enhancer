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
  timeout: process.env.CI ? 120000 : 30000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 15 : undefined,
  /* Retry on CI only */
  retries: process.env.CI ? 5 : 0,
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
    trace: 'on',
    screenshot: 'on',
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 }
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'theme-setup',
      testMatch: /theme.setup\.ts/,
      timeout: 0,
      use: {
        isThemeRoom: true,
        channel: 'chrome'
      }
    },
    {
      name: 'units',
      testMatch: '**/units/*.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      timeout: 300000,
    },
    {
      name: 'integrations',
      testMatch: '**/integrations/*.spec.ts',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      timeout: 300000,
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testIgnore: [
        '**/integrations/**',
        '**/units/**',
      ],
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      testIgnore: [
        '**/integrations/**',
        '**/units/**',
      ],
    },
    {
      name: 'edge-theme',
      dependencies: ['theme-setup'],
      use: { ...devices['Desktop Edge'], channel: 'msedge', isThemeRoom: true },
      testIgnore: [
        '**/integrations/**',
        '**/units/**',
      ],
    },
    {
      name: 'chrome-theme',
      dependencies: ['theme-setup'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome', isThemeRoom: true },
      testIgnore: [
        '**/integrations/**',
        '**/units/**',
      ],
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
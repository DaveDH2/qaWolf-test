import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://news.ycombinator.com';


export default defineConfig({
  globalSetup: './global-setup.js',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',

  use: {
    headless: false,
    trace: 'on-first-retry',
    baseURL,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add other browsers here if needed
  ],
});

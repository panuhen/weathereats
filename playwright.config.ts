import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1366, height: 900 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
    // No testIdAttribute needed; default is "data-testid"
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'artifacts/e2e-report.json' }]
  ],
  projects: [{ name: 'chromium' }]
});

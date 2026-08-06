import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 120_000,
    // `astro preview` auto-daemonizes when it detects an agentic CLI (e.g. Claude Code)
    // via the am-i-vibing package, which makes the launcher process exit immediately and
    // breaks Playwright's webServer (it needs a blocking foreground process). Opting out
    // of that auto-detection keeps preview in the foreground here; harmless elsewhere.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
});

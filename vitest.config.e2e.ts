import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000, // Increase the timeout for e2e tests
    globals: true, // Required for global variables like `describe` and `it`
    include: ['src/e2e/**/*.test.ts'], // Include files with the .spec.ts extension in the e2e folder
  },
});
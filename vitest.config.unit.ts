import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ command, mode }) => ({
  test: {
    include: ['./tests/**/*.test.ts'],
    setupFiles: [
      path.resolve(__dirname, 'src/__mocks__/ioredis.ts'), // Path to my mocked Redis client
      path.resolve(__dirname, 'test-setup.ts'), // Path to my test setup file
    ],
    mockImportMeta: true,
  },
  resolve: {
    alias: {
      '@/': new URL('../../../src/', import.meta.url).pathname,
    },
  },
}));
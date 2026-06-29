import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    reporters: [
      'default',
      ['html', { singleFile: true, outputFile: 'vitest-report/index.html' }],
    ],
    clearMocks: true,
    restoreMocks: true,
    mockReset: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['tests/**/*', 'node_modules/**/*', 'src/data/**/*'],
      thresholds: {
        statements: 96,
        branches: 94,
        functions: 94,
        lines: 100,
      },
    },
  },
});

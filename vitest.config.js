import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      UPLOADER_URL: 'http://localhost:7337',
      RUNTIME_URL: 'http://localhost:8085'
    },
    globals: true,
    environment: 'node',
    clearMocks: true,
    testTimeout: 10000,
    coverage: {
      ...configDefaults.coverage,
      reportOnFailure: true,
      clean: false,
      reportsDirectory: 'coverage',
      reporter: ['lcov'],
      include: ['src/**/*.js'],
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '.server',
        'src/index.js'
      ]
    }
  }
})

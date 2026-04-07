import { constants as statusCodes } from 'node:http2'

import nock from 'nock'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../../mocks/nock-setup.js'
import { mockRuns, mockContexts } from '../../../../mocks/runtime-api.js'
import { config } from '../../../../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

describe('Setup Page', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    setupNock()
  })

  afterEach(() => {
    teardownNock()
  })

  describe('GET /guidance/{runId}/setup', () => {
    test('Should return 200 OK and render setup page', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mockContexts.withDocuments)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/setup`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()

      expect(payload).toContain('9 March 2026 10:15')
    })
  })

  describe('POST /guidance/{runId}/start', () => {
    test('Should start a run and redirect to setup page', async () => {
      const runId = 'test-run-123'

      // Mock the start run endpoint
      nock(runtimeUrl)
        .post(`/runs/${runId}/start`)
        .reply(202, {
          ...mockRuns.success,
          status: 'pending'
        })

      // Mock the subsequent GET to fetch run and contexts for the redirect
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, {
          ...mockRuns.success,
          status: 'pending'
        })

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mockContexts.withDocuments)

      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/start`,
        payload: {}
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_FOUND)
      expect(headers.location).toBe(`/guidance/${runId}/setup`)
    })

    test('Should return 500 error when runtime API fails', async () => {
      const runId = 'nonexistent-run'

      nock(runtimeUrl)
        .post(`/runs/${runId}/start`)
        .reply(404, {
          error: 'Not Found',
          message: 'Run not found'
        })

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/start`,
        payload: {}
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    })

    test('Should return 500 error on bad request from runtime', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .post(`/runs/${runId}/start`)
        .reply(400, {
          error: 'Bad Request',
          message: 'No task defined'
        })

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/start`,
        payload: {}
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    })

    test('Should return 500 error on server error from runtime', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .post(`/runs/${runId}/start`)
        .reply(500, {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred'
        })

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/start`,
        payload: {}
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    })
  })
})

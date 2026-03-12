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
})

import { constants as statusCodes } from 'node:http2'
import nock from 'nock'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../../../mocks/nock-setup.js'
import { mockRuns } from '../../../../../mocks/runtime-api.js'
import { config } from '../../../../../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

describe('Upload Page', () => {
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

  describe('GET /guidance/{runId}/upload', () => {
    test('Should redirect to setup when uploadId query is missing', async () => {
      const runId = 'test-run-123'

      // The controller short-circuits and redirects when uploadId is not provided,
      // so mocking the run endpoint is optional but harmless.
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, headers } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/upload`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_FOUND)
      expect(headers.location).toBe(`/guidance/${runId}/setup`)
    })
  })
})

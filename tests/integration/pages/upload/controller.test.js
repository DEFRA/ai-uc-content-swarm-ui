import { constants as statusCodes } from 'node:http2'

import nock from 'nock'

import { createServer } from '../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../mocks/nock-setup.js'
import { mockRuns } from '../../../mocks/runtime-api.js'
import { config } from '../../../../src/config/config.js'

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
    test('Should return 200 OK and render upload form', async () => {
      const runId = 'test-run-123'
      const uploadId = 'upload-456'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/upload?uploadId=${uploadId}`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()
    })
  })
})

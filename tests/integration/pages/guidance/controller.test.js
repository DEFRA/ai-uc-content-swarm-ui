import { constants as statusCodes } from 'node:http2'
import nock from 'nock'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../mocks/nock-setup.js'
import { mockUploadSession, mockRuns, mockContexts } from '../../../mocks/runtime-api.js'
import { config } from '../../../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

describe('Guidance Page', () => {
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

  describe('POST /guidance/{runId}/upload/initiate', () => {
    test('Should initiate upload with valid metadata', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .post(`/runs/${runId}/contexts`, body => body !== null && typeof body === 'object')
        .reply(201, mockUploadSession.success)

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          title: 'Test Document',
          description: 'A test document'
        }
      })

      expect(statusCode).toBeLessThan(400) // Expect success (2xx or 3xx)
    })
  })

  describe('GET /guidance/{runId}/upload/metadata', () => {
    test('Should return 200 OK and render context/metadata form', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/upload/metadata`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()
    })
  })
})

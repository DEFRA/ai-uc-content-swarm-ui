import { constants as statusCodes } from 'node:http2'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../src/server/server.js'
import { mockInitiateContextUploadSuccess, mockGetRunContextsSuccess, cleanupMocks } from '../../../mocks/nock-setup.js'
import { mockUploadSession, mockContexts } from '../../../mocks/runtime-api.js'

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
    cleanupMocks()
  })

  afterEach(() => {
    cleanupMocks()
  })

  describe('POST /guidance/{runId}/upload/initiate', () => {
    test('Should initiate upload with valid metadata', async () => {
      const runId = 'test-run-123'
      mockInitiateContextUploadSuccess(runId, mockUploadSession.success)

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          filename: 'test-document.pdf',
          mimeType: 'application/pdf'
        }
      })

      expect(statusCode).toBeLessThan(400) // Expect success (2xx or 3xx)
    })
  })

  describe('GET /guidance/{runId}/upload/metadata', () => {
    test('Should return 200 OK and render context/metadata form', async () => {
      const runId = 'test-run-123'
      mockGetRunContextsSuccess(runId, mockContexts.empty)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/upload/metadata`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()
    })
  })
})

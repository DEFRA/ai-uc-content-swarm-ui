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

      expect(statusCode).toBeLessThan(400)
    })

    test('Should fail validation with missing title', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          description: 'A description without title'
        }
      })

      expect(statusCode).toBe(400)
      expect(payload).toContain('Document title is required')
    })

    test('Should fail validation with empty title', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          title: '',
          description: 'A description'
        }
      })

      expect(statusCode).toBe(400)
      expect(payload).toContain('Document title is required')
    })

    test('Should fail validation with whitespace-only title', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          title: '   ',
          description: 'A description'
        }
      })

      expect(statusCode).toBe(400)
      expect(payload).toContain('Document title is required')
    })

    test('Should allow empty description', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .post(`/runs/${runId}/contexts`, body => body !== null && typeof body === 'object')
        .reply(201, { id: 'context-456', uploadId: 'upload-789' })

      const { statusCode } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          title: 'Test Title',
          description: ''
        }
      })

      expect(statusCode).toBeLessThan(400)
    })

    test('Should include form template in error response', async () => {
      const runId = 'test-run-123'
      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      const { statusCode, payload } = await server.inject({
        method: 'POST',
        url: `/guidance/${runId}/upload/initiate`,
        payload: {
          title: ''
        }
      })

      expect(statusCode).toBe(400)
      expect(payload).toContain('form')
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

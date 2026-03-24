import { constants as statusCodes } from 'node:http2'

import nock from 'nock'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../../mocks/nock-setup.js'
import { mockRuns, mockContexts } from '../../../../mocks/runtime-api.js'
import { config } from '../../../../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

describe('Status Page', () => {
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

  describe('GET /guidance/{runId}/status', () => {
    test('Should return 200 OK and render the contexts table', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mockContexts.withDocuments)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/status`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toContain('Test Guidance Run')
      expect(payload).toContain('Supporting Context')
    })

    test('Should show "Create draft" button when all contexts are complete', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mockContexts.withDocuments)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/status`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toContain('Create draft')
    })

    test('Should hide "Create draft" button when not all contexts are complete', async () => {
      const runId = 'test-run-123'

      const mixedContexts = [
        {
          id: 'ctx-001',
          filename: 'document.pdf',
          status: 'complete',
          createdAt: '2026-03-09T10:15:00Z'
        },
        {
          id: 'ctx-002',
          filename: 'reference.doc',
          status: 'pending',
          createdAt: '2026-03-09T10:20:00Z'
        }
      ]

      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mixedContexts)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/status`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).not.toContain('Create draft')
    })

    test('Should hide "Create draft" button when there are no contexts', async () => {
      const runId = 'test-run-123'

      nock(runtimeUrl)
        .get(`/runs/${runId}`)
        .reply(200, mockRuns.success)

      nock(runtimeUrl)
        .get(`/runs/${runId}/contexts`)
        .reply(200, mockContexts.empty)

      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: `/guidance/${runId}/status`
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).not.toContain('Create draft')
    })
  })
})

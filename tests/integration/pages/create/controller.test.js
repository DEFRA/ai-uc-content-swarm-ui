import { constants as statusCodes } from 'node:http2'
import nock from 'nock'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../src/server/server.js'
import { setupNock, teardownNock } from '../../../mocks/nock-setup.js'
import { mockRuns } from '../../../mocks/runtime-api.js'
import { config } from '../../../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

describe('Create Page', () => {
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

  describe('GET /guidance/new', () => {
    test('Should return 200 OK and render create form', async () => {
      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: '/guidance/new'
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()
    })
  })

  describe('POST /guidance/new', () => {
    test('Should redirect with valid runName payload', async () => {
      nock(runtimeUrl)
        .post('/runs', body => body.name !== undefined)
        .reply(201, mockRuns.success)

      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/guidance/new',
        payload: {
          runName: 'Test Guidance Run'
        }
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_FOUND)
      expect(headers.location).toMatch(/^\/guidance\/[\w-]+\/setup$/)
    })

    test('Should trim whitespace from runName', async () => {
      nock(runtimeUrl)
        .post('/runs', body => body.name !== undefined)
        .reply(201, mockRuns.anotherSuccess)

      const { statusCode, headers } = await server.inject({
        method: 'POST',
        url: '/guidance/new',
        payload: {
          runName: '  Trimmed Run  '
        }
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_FOUND)
      expect(headers.location).toMatch(/^\/guidance\/[\w-]+\/setup$/)
    })

    test('Should handle runtime API error gracefully', async () => {
      nock(runtimeUrl)
        .post('/runs', body => body.name !== undefined)
        .reply(500, { error: 'Internal error' })

      const { statusCode } = await server.inject({
        method: 'POST',
        url: '/guidance/new',
        payload: {
          runName: 'Error Test'
        }
      })

      expect(statusCode).toBeGreaterThanOrEqual(500)
    })
  })
})

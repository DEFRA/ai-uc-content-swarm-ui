import { constants as statusCodes } from 'node:http2'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../src/server/server.js'
import { mockCreateRunSuccess, cleanupMocks } from '../../../mocks/nock-setup.js'
import { mockRuns } from '../../../mocks/runtime-api.js'

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
    cleanupMocks()
  })

  afterEach(() => {
    cleanupMocks()
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
      mockCreateRunSuccess({ name: 'Test Guidance Run' }, mockRuns.success)

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
      mockCreateRunSuccess({ name: 'Trimmed Run' }, mockRuns.anotherSuccess)

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

    test('Should reject empty runName with 400', async () => {
      const { statusCode } = await server.inject({
        method: 'POST',
        url: '/guidance/new',
        payload: {
          runName: ''
        }
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_BAD_REQUEST)
    })

    test('Should reject missing runName with 400', async () => {
      const { statusCode } = await server.inject({
        method: 'POST',
        url: '/guidance/new',
        payload: {}
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_BAD_REQUEST)
    })

    test('Should handle runtime API error gracefully', async () => {
      mockCreateRunSuccess({ name: 'Error Test' }, { error: 'Internal error' })

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

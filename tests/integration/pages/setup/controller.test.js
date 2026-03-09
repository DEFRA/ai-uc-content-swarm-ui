import { constants as statusCodes } from 'node:http2'
import { beforeEach, afterEach } from 'vitest'

import { createServer } from '../../../../src/server/server.js'
import { cleanupMocks } from '../../../mocks/nock-setup.js'

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
    cleanupMocks()
  })

  afterEach(() => {
    cleanupMocks()
  })

  describe('GET /guidance/{runId}/setup', () => {
    test('Should return 200 OK and render setup page', async () => {
      const { statusCode, payload } = await server.inject({
        method: 'GET',
        url: '/guidance/test-run-123/setup'
      })

      expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
      expect(payload).toBeTruthy()
    })
  })
})

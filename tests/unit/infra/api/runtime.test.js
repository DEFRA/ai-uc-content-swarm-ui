import * as runsApi from '../../../../src/infra/api/runtime.js'

global.fetch = vi.fn()

describe('Runtime API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('createRun', () => {
    test('Should call POST /runs with run name payload', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'run-123', name: 'Test Run' })
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const result = await runsApi.createRun({ name: 'Test Run' })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/runs'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      )
      expect(result.id).toBe('run-123')
    })

    test('Should pass payload as-is to the API', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'run-456', name: 'Test' })
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const payload = { name: '  Untrimmed  ' }
      await runsApi.createRun(payload)

      const callArgs = global.fetch.mock.calls[0]
      const bodyText = callArgs[1].body
      const parsedBody = JSON.parse(bodyText)
      // The API passes the payload as-is; trimming is done by the controller
      expect(parsedBody.name).toBe('  Untrimmed  ')
    })

    test('Should throw error when API returns not ok', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error'
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      await expect(runsApi.createRun({ name: 'Test' })).rejects.toThrow(
        /Failed to create run/
      )
    })
  })

  describe('getRun', () => {
    test('Should call GET /runs/:id to fetch run', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ id: 'run-789', name: 'Retrieved Run', status: 'running' })
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      const result = await runsApi.getRun('run-789')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/runs/run-789'),
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
      )
      expect(result.id).toBe('run-789')
      expect(result.status).toBe('running')
    })

    test('Should throw error with statusCode when API call fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      global.fetch.mockResolvedValueOnce(mockResponse)

      try {
        await runsApi.getRun('unknown-run')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('Failed to get run')
        expect(error.statusCode).toBe(404)
      }
    })
  })
})

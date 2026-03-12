import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createRun,
  getRun,
  getRunContexts,
  initiateContextUpload
} from '../../../../src/infra/api/runtime.js'
import * as runsApi from '../../../../src/infra/api/runtime.js'

describe('src/infra/api/runtime.js - unhappy / 204 cases', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('createRun throws when response is not ok', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({})
    })

    await expect(createRun({ name: 'test' })).rejects.toThrow('Failed to create run')
  })

  it('getRun throws and sets statusCode on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({})
    })

    await expect(getRun('run-1')).rejects.toMatchObject({ statusCode: 404 })
  })

  it('getRunContexts returns [] when runtime responds 204 No Content', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
      json: async () => []
    })

    const res = await getRunContexts('run-1')
    expect(res).toEqual([])
  })

  it('getRunContexts throws and sets statusCode on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: async () => ({})
    })

    await expect(getRunContexts('run-1')).rejects.toMatchObject({ statusCode: 500 })
  })

  it('initiateContextUpload throws on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({})
    })

    await expect(initiateContextUpload('run-1', { redirect: null })).rejects.toMatchObject({ statusCode: 400 })
  })
})

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

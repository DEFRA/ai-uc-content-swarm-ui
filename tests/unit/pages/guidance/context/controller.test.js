import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import * as runsApi from '../../../../../../src/infra/api/runtime.js'
import { handleValidationError } from '../../../../../../src/pages/guidance/context/controller.js'
import { statusCodes } from '../../../../../../src/constants/status-codes.js'

describe('context controller - handleValidationError', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('propagates when runsApi.getRun throws', async () => {
    const err = new Error('api failure')
    vi.spyOn(runsApi, 'getRun').mockRejectedValue(err)

    await expect(handleValidationError({ params: { runId: 'r1' } }, null, { details: [] })).rejects.toThrow(err)
  })

  test('renders view and returns takeover for validation errors', async () => {
    const run = { id: 'r1', name: 'My Run' }
    vi.spyOn(runsApi, 'getRun').mockResolvedValue(run)

    const joiError = {
      details: [
        { path: 'title', message: 'Title is required' }
      ]
    }

    const takeover = vi.fn(() => 'TAKEOVER')
    const code = vi.fn(() => ({ takeover }))
    const view = vi.fn(() => ({ code }))

    const h = { view }

    const result = await handleValidationError({ params: { runId: 'r1' } }, h, joiError)

    expect(runsApi.getRun).toHaveBeenCalledWith('r1')
    expect(view).toHaveBeenCalledWith('guidance/context/context-collect', { run, errors: { title: 'Title is required' } })
    expect(code).toHaveBeenCalledWith(statusCodes.HTTP_STATUS_BAD_REQUEST)
    expect(takeover).toHaveBeenCalled()
    expect(result).toBe('TAKEOVER')
  })
})

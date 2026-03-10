import { describe, test, expect, vi } from 'vitest'

import { handleValidationError } from '../../../../../../src/pages/guidance/create/controller.js'
import { statusCodes } from '../../../../../../src/constants/status-codes.js'

describe('create controller - handleValidationError', () => {
  test('throws non-Joi errors', () => {
    const err = new Error('not a joi error')

    expect(() => handleValidationError(null, null, err)).toThrow(err)
  })

  test('renders view and returns takeover for Joi validation errors', () => {
    const joiError = {
      isJoi: true,
      details: [
        { path: 'runName', message: 'Run name is required' }
      ]
    }

    const takeover = vi.fn(() => 'TAKEOVER')
    const code = vi.fn(() => ({ takeover }))
    const view = vi.fn(() => ({ code }))

    const h = { view }

    const result = handleValidationError(null, h, joiError)

    expect(view).toHaveBeenCalledWith('guidance/create/page', { errors: { runName: 'Run name is required' } })
    expect(code).toHaveBeenCalledWith(statusCodes.HTTP_STATUS_BAD_REQUEST)
    expect(takeover).toHaveBeenCalled()
    expect(result).toBe('TAKEOVER')
  })
})

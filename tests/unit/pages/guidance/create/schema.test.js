import { describe, test, expect } from 'vitest'

import { createRunSchema, validate } from '../../../../../src/pages/guidance/create/schema.js'

describe('createRunSchema', () => {
  test('should pass validation with valid runName', () => {
    const { error, value } = createRunSchema.validate({
      runName: 'My Test Run'
    })

    expect(error).toBeUndefined()
    expect(value).toBeDefined()
    expect(value.runName).toBe('My Test Run')
  })

  test('should trim whitespace from runName', () => {
    const { error, value } = createRunSchema.validate({
      runName: '  Trimmed Run  '
    })

    expect(error).toBeUndefined()
    expect(value.runName).toBe('Trimmed Run')
  })

  test('should fail validation when runName is missing', () => {
    const [, errors] = validate({})

    expect(errors).toBeDefined()
    expect(errors.runName).toContain('Run name is required')
  })

  test('should fail validation when runName is empty string', () => {
    const [, errors] = validate({
      runName: ''
    })

    expect(errors).toBeDefined()
    expect(errors.runName).toContain('Run name is required')
  })

  test('should fail validation when runName is whitespace only', () => {
    const [, errors] = validate({
      runName: '   '
    })

    expect(errors).toBeDefined()
    expect(errors.runName).toContain('Run name is required')
  })

  test('should fail validation when runName is not a string', () => {
    const [, errors] = validate({
      runName: 123
    })

    expect(errors).toBeDefined()
  })

  test('should reject extra fields', () => {
    const [, errors] = validate({
      runName: 'Test Run',
      extraField: 'should be rejected'
    })

    expect(errors).toBeDefined()
  })
})

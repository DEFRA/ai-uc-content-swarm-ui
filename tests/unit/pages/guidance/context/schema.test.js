import { describe, test, expect } from 'vitest'

import { metadataSchema, validate } from '../../../../../src/pages/guidance/context/schema.js'

describe('metadataSchema', () => {
  test('should pass validation with valid title and description', () => {
    const { error, value } = metadataSchema.validate({
      title: 'Document Title',
      description: 'A detailed description'
    })

    expect(error).toBeUndefined()
    expect(value).toBeDefined()
    expect(value.title).toBe('Document Title')
    expect(value.description).toBe('A detailed description')
  })

  test('should pass validation with title only (description optional)', () => {
    const { error, value } = metadataSchema.validate({
      title: 'Document Title'
    })

    expect(error).toBeUndefined()
    expect(value).toBeDefined()
    expect(value.title).toBe('Document Title')
    expect(value.description).toBeUndefined()
  })

  test('should trim whitespace from title', () => {
    const { error, value } = metadataSchema.validate({
      title: '  Trimmed Title  ',
      description: 'Some description'
    })

    expect(error).toBeUndefined()
    expect(value.title).toBe('Trimmed Title')
  })

  test('should trim whitespace from description', () => {
    const { error, value } = metadataSchema.validate({
      title: 'Title',
      description: '  Trimmed Description  '
    })

    expect(error).toBeUndefined()
    expect(value.description).toBe('Trimmed Description')
  })

  test('should allow empty string for description', () => {
    const { error, value } = metadataSchema.validate({
      title: 'Document Title',
      description: ''
    })

    expect(error).toBeUndefined()
    expect(value.description).toBe('')
  })

  test('should fail validation when title is missing', () => {
    const [, errors] = validate({
      description: 'A description without title'
    })

    expect(errors).toBeDefined()
    expect(errors.title).toContain('Document title is required')
  })

  test('should fail validation when title is empty string', () => {
    const [, errors] = validate({
      title: '',
      description: 'A description'
    })

    expect(errors).toBeDefined()
    expect(errors.title).toContain('Document title is required')
  })

  test('should fail validation when title is whitespace only', () => {
    const [, errors] = validate({
      title: '   ',
      description: 'A description'
    })

    expect(errors).toBeDefined()
    expect(errors.title).toContain('Document title is required')
  })

  test('should fail validation when title is not a string', () => {
    const [, errors] = validate({
      title: 123,
      description: 'A description'
    })

    expect(errors).toBeDefined()
  })

  test('should fail validation when description is not a string', () => {
    const [, errors] = validate({
      title: 'Document Title',
      description: 123
    })

    expect(errors).toBeDefined()
  })

  test('should reject extra fields', () => {
    const [, errors] = validate({
      title: 'Document Title',
      description: 'A description',
      extraField: 'should be rejected'
    })

    expect(errors).toBeDefined()
  })
})

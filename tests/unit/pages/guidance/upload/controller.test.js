import { describe, test, expect, vi, beforeEach } from 'vitest'

import { showUploadForm } from '../../../../../src/pages/guidance/upload/controller.js'
import { config } from '../../../../../src/config/config.js'
import * as runsApi from '../../../../../src/infra/api/runtime.js'

describe('upload controller - showUploadForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  test('uses configured uploader base when present', async () => {
    vi.spyOn(config, 'get').mockImplementation(() => 'http://uploader.test')
    vi.spyOn(runsApi, 'getRun').mockResolvedValue({ id: 'run1' })

    const request = { params: { runId: 'run1' }, query: { uploadId: 'upload-123' } }
    const code = vi.fn(() => 'TAKEOVER')
    const view = vi.fn(() => ({ code }))
    const h = { view }

    const result = await showUploadForm(request, h)

    expect(view).toHaveBeenCalledWith(
      'guidance/upload/upload',
      expect.objectContaining({ uploadAction: 'http://uploader.test/upload-and-scan/upload-123' })
    )
    expect(result).toBe('TAKEOVER')
  })

  test('falls back to relative path when uploader base missing', async () => {
    vi.spyOn(config, 'get').mockImplementation(() => null)
    vi.spyOn(runsApi, 'getRun').mockResolvedValue({ id: 'run2' })

    const request = { params: { runId: 'run2' }, query: { uploadId: 'upload-456' } }
    const code = vi.fn(() => 'TAKEOVER')
    const view = vi.fn(() => ({ code }))
    const h = { view }

    const result = await showUploadForm(request, h)

    expect(view).toHaveBeenCalledWith(
      'guidance/upload/upload',
      expect.objectContaining({ uploadAction: '/upload-and-scan/upload-456' })
    )
    expect(result).toBe('TAKEOVER')
  })
})

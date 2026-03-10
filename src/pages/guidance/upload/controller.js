import { statusCodes } from '../../../constants/status-codes.js'
import { config } from '../../../config/config.js'

import * as runsApi from '../../../infra/api/runtime.js'
import { UploadViewModel } from './view-model.js'

/**
 * Show the upload form for a run
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with runId param and uploadId query
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The upload form page or redirect to metadata
 */
async function showUploadForm (request, h) {
  const { runId } = request.params
  const { uploadId: queryUploadId } = request.query

  if (!queryUploadId) {
    return h.redirect(`/guidance/${runId}/upload/metadata`)
      .code(statusCodes.HTTP_STATUS_FOUND)
  }

  const run = await runsApi.getRun(runId)
  const uploaderBase = config.get('uploader.url')
  const uploadAction = `${String(uploaderBase).replace(/\/$/, '')}/upload-and-scan/${queryUploadId}`

  const viewData = new UploadViewModel({ run, uploadAction })
  return h.view('guidance/upload/upload', viewData)
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  showUploadForm
}

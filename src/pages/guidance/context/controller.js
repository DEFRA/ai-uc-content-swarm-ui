import Boom from '@hapi/boom'

import { statusCodes } from '../../../constants/status-codes.js'

import * as runsApi from '../../../infra/api/runtime.js'
import { ContextViewModel } from './view-model.js'
import { validate } from './schema.js'

/**
 * Show the metadata collection form for uploading a context document
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with runId param
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The metadata form page or 404 error
 */
async function showContextForm (request, h) {
  const { runId } = request.params
  const run = await runsApi.getRun(runId)

  const viewData = new ContextViewModel({ run })
  return h.view('guidance/context/context-collect', viewData)
    .code(statusCodes.HTTP_STATUS_OK)
}

/**
 * Initiate a CDP uploader session for the run with metadata
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with runId param and validated metadata in payload
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} Redirect to upload form with uploadId or error response
 */
async function initiateUpload (request, h) {
  const { runId } = request.params
  const { title, description } = request.payload

  const response = await runsApi.initiateContextUpload(runId, {
    title: title.trim(),
    description: description ? description.trim() : null,
    redirect: `/guidance/${runId}/setup`
  })

  const uploadId = response?.uploadId

  if (!uploadId) {
    return Boom.internal('Failed to initiate upload session')
  }

  return h.redirect(`/guidance/${runId}/upload?uploadId=${uploadId}`)
    .code(statusCodes.HTTP_STATUS_FOUND)
}

/**
 * Custom failAction handler for context metadata validation errors
 * Renders the context-collect template with validation errors
 *
 * @param {import('@hapi/hapi').Request} request - The request
 * @param {import('@hapi/hapi').ResponseToolkit} h - The response toolkit
 * @param {Error} error - The validation error
 *
 * @returns {import('@hapi/hapi').ResponseObject} Response with error view
 */
async function handleValidationError (request, h, error) {
  if (error.isJoi) {
    const { runId } = request.params
    const [, errors] = validate(request.payload)

    const run = await runsApi.getRun(runId)

    return h.view('guidance/context/context-collect', new ContextViewModel({ run, errors }))
      .code(400)
      .takeover()
  }

  throw error
}

export {
  showContextForm,
  initiateUpload,
  handleValidationError
}

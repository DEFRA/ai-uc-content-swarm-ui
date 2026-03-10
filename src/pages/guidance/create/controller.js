import { statusCodes } from '../../../constants/status-codes.js'

import * as runsApi from '../../../infra/api/runtime.js'
import { CreateViewModel } from './view-model.js'
import { validate } from './schema.js'

/**
 * Show create run form
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object for the guidance creation form
 */
function showCreateForm (_request, h) {
  const viewData = new CreateViewModel({})
  return h.view('guidance/create/page', viewData)
    .code(statusCodes.HTTP_STATUS_OK)
}

/**
 * Create a new run via HTTP POST to the runtime
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with validated runName in payload
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} Redirect to run setup page or error
 */
async function createRun (request, h) {
  const { runName } = request.payload

  const response = await runsApi.createRun({ name: runName })

  return h.redirect(`/guidance/${response.id}/setup`)
    .code(statusCodes.HTTP_STATUS_FOUND)
}

/**
 * Custom failAction handler for create validation errors
 * Renders the create page template with validation errors
 *
 * @param {import('@hapi/hapi').Request} request - The request
 * @param {import('@hapi/hapi').ResponseToolkit} h - The response toolkit
 * @param {Error} error - The validation error
 *
 * @returns {import('@hapi/hapi').ResponseObject} Response with error view
 */
function handleValidationError (_request, h, error) {
  if (error.isJoi) {
    const [, errors] = validate(_request.payload)

    return h.view('guidance/create/page', new CreateViewModel({ errors }))
      .code(400)
      .takeover()
  }

  throw error
}

export {
  showCreateForm,
  createRun,
  handleValidationError
}

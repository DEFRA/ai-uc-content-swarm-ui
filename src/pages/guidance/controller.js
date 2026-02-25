import { statusCodes } from '../../constants/status-codes.js'

/**
 * Get new guidance form controller 
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object for the new guidance form
 */
function getNewGuidanceForm (_request, h) {

  return h.view('guidance/new')
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  getNewGuidanceForm
}

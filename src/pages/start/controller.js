import { statusCodes } from '../../constants/status-codes.js'

/**
 * Get new start form controller
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object for the start guidance form
 */
function getStartPage (_request, h) {
  return h.view('start/page')
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  getStartPage
}

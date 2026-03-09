import { statusCodes } from '../../../constants/status-codes.js'

import * as runsApi from '../../../infra/api/runtime.js'
import { buildSetupView } from './view-model.js'

/**
 * Show run setup page with context management
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with runId param
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The run setup page or 404 error
 */
async function showSetup (request, h) {
  const { runId } = request.params
  const run = await runsApi.getRun(runId)
  const contexts = await runsApi.getRunContexts(runId)

  const viewData = buildSetupView({ run, contexts })
  return h.view('guidance/setup/setup', viewData)
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  showSetup
}

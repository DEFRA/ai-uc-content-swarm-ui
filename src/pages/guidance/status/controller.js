import { statusCodes } from '../../../constants/status-codes.js'

import * as runsApi from '../../../infra/api/runtime.js'
import { createStatusViewModel } from './view-model.js'

/**
 * Show the review page before executing a run
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object with runId param
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The review page
 */
async function showStatus (request, h) {
  const { runId } = request.params

  const run = await runsApi.getRun(runId)
  const contexts = await runsApi.getRunContexts(runId)

  const viewData = createStatusViewModel({ run, contexts })

  return h.view('guidance/status/status', viewData)
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  showStatus
}

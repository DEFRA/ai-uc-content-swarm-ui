import { config } from '../../config/config.js'

const runtimeUrl = config.get('runtime.url')

/**
 * Call runtime API to create a new run
 *
 * @param {Object} payload - The request payload
 * @param {string} payload.name - The name of the run
 *
 * @returns {Promise<Object>} The created run response
 * @throws {Error} If the API call fails
 */
async function createRun (payload) {
  const response = await fetch(`${runtimeUrl}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Failed to create run: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch a run by ID from the runtime
 *
 * @param {string} runId - The ID of the run to fetch
 *
 * @returns {Promise<Object>} The run object
 * @throws {Error} If the API call fails
 */
async function getRun (runId) {
  const response = await fetch(`${runtimeUrl}/runs/${runId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = new Error(`Failed to get run: ${response.statusText}`)
    error.statusCode = response.status

    throw error
  }

  return response.json()
}

/**
 * Fetch contexts (documents) for a run from the runtime
 *
 * @param {string} runId - The ID of the run
 *
 * @returns {Promise<Array>} List of context documents
 * @throws {Error} If the API call fails
 */
async function getRunContexts (runId) {
  const response = await fetch(`${runtimeUrl}/runs/${runId}/contexts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get run contexts: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Initiate a context upload session for a run
 *
 * @param {string} runId - The ID of the run
 * @param {Object} requestPayload - The upload request payload
 * @param {string|null} requestPayload.redirect - Optional redirect URL after upload
 *
 * @returns {Promise<Object>} The upload initiation response with upload_id
 * @throws {Error} If the API call fails
 */
async function initiateContextUpload (runId, requestPayload) {
  const response = await fetch(`${runtimeUrl}/runs/${runId}/contexts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestPayload)
  })

  if (!response.ok) {
    const error = new Error(`Failed to initiate upload: ${response.statusText}`)
    error.statusCode = response.status

    throw error
  }

  return await response.json()
}

export {
  createRun,
  getRun,
  getRunContexts,
  initiateContextUpload
}

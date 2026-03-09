/**
 * Nock setup helpers for testing runtime API integration
 */

import nock from 'nock'
import { config } from '../../src/config/config.js'

const runtimeUrl = config.get('runtime.url')

/**
 * Mock successful run creation
 */
export function mockCreateRunSuccess (payload, response) {
  return nock(runtimeUrl)
    .post('/runs', body => {
      // Verify request body contains expected payload
      return body.name !== undefined
    })
    .reply(201, response)
}

/**
 * Mock failed run creation
 */
export function mockCreateRunError (statusCode = 500, errorResponse = {}) {
  return nock(runtimeUrl)
    .post('/runs')
    .reply(statusCode, errorResponse)
}

/**
 * Mock successful get run
 */
export function mockGetRunSuccess (runId, response) {
  return nock(runtimeUrl)
    .get(`/runs/${runId}`)
    .reply(200, response)
}

/**
 * Mock failed get run
 */
export function mockGetRunError (runId, statusCode = 404, errorResponse = {}) {
  return nock(runtimeUrl)
    .get(`/runs/${runId}`)
    .reply(statusCode, errorResponse)
}

/**
 * Mock successful context upload initiation
 */
export function mockInitiateContextUploadSuccess (runId, response) {
  return nock(runtimeUrl)
    .post(`/runs/${runId}/contexts`, body => {
      // Verify request body is valid
      return body !== null && typeof body === 'object'
    })
    .reply(201, response)
}

/**
 * Mock failed context upload initiation
 */
export function mockInitiateContextUploadError (runId, statusCode = 500, errorResponse = {}) {
  return nock(runtimeUrl)
    .post(`/runs/${runId}/contexts`)
    .reply(statusCode, errorResponse)
}

/**
 * Mock successful get run contexts
 */
export function mockGetRunContextsSuccess (runId, response) {
  return nock(runtimeUrl)
    .get(`/runs/${runId}/contexts`)
    .reply(200, response)
}

/**
 * Mock failed get run contexts
 */
export function mockGetRunContextsError (runId, statusCode = 500, errorResponse = {}) {
  return nock(runtimeUrl)
    .get(`/runs/${runId}/contexts`)
    .reply(statusCode, errorResponse)
}

/**
 * Clean up all nock mocks
 */
export function cleanupMocks () {
  nock.cleanAll()
}

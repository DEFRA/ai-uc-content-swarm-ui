import * as createController from './create/controller.js'
import { createRunSchema } from './create/schema.js'
import * as setupController from './setup/controller.js'
import * as contextController from './context/controller.js'
import { metadataSchema } from './context/schema.js'
import * as uploadController from './upload/controller.js'
import * as statusController from './status/controller.js'

const routes = [
  {
    method: 'GET',
    path: '/guidance/new',
    handler: createController.showCreateForm
  },
  {
    method: 'POST',
    path: '/guidance/new',
    handler: createController.createRun,
    options: {
      validate: {
        payload: createRunSchema,
        failAction: createController.handleValidationError
      }
    }
  },
  {
    method: 'GET',
    path: '/guidance/{runId}/setup',
    handler: setupController.showSetup
  },
  {
    method: 'GET',
    path: '/guidance/{runId}/upload/metadata',
    handler: contextController.showContextForm
  },
  {
    method: 'POST',
    path: '/guidance/{runId}/upload/initiate',
    handler: contextController.initiateUpload,
    options: {
      validate: {
        payload: metadataSchema,
        failAction: contextController.handleValidationError
      }
    }
  },
  {
    method: 'GET',
    path: '/guidance/{runId}/upload',
    handler: uploadController.showUploadForm
  },
  {
    method: 'GET',
    path: '/guidance/{runId}/status',
    handler: statusController.showStatus
  }
]

const guidanceRouter = {
  plugin: {
    name: 'guidanceRouter',
    register (server) {
      server.route(routes)
    }
  }
}

export {
  guidanceRouter
}

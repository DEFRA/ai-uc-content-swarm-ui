import * as guidanceController from './controller.js'

const routes = [
  {
    method: 'GET',
    path: '/guidance/new',
    handler: guidanceController.getStartPage
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

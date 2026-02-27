import * as startController from './controller.js'

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: startController.getStartPage
  }
]

const startRouter = {
  plugin: {
    name: 'startRouter',
    register (server) {
      server.route(routes)
    }
  }
}

export {
  startRouter
}

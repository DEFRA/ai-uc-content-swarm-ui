import { startRouter } from './start/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        startRouter
      ])
    }
  }
}

export {
  pageRouter
}

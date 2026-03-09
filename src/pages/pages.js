import { startRouter } from './start/router.js'
import { guidanceRouter } from './guidance/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        startRouter,
        guidanceRouter
      ])
    }
  }
}

export {
  pageRouter
}

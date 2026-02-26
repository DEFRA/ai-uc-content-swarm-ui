import { guidanceRouter } from './start/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        guidanceRouter
      ])
    }
  }
}

export {
  pageRouter
}

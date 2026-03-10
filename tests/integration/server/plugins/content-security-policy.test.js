describe('#contentSecurityPolicy', () => {
  beforeEach(() => {
    vitest.resetModules()
    vitest.unstubAllEnvs()
  })

  test('Should set the CSP policy header', async () => {
    const { createServer } = await import('../../../../src/server/server.js')

    const server = await createServer()
    await server.initialize()

    const resp = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(resp.headers['content-security-policy']).toBeDefined()

    await server.stop({ timeout: 0 })
  })

  test('should not be enabled in development environment', async () => {
    vitest.stubEnv('NODE_ENV', 'development')

    const { createServer } = await import('../../../../src/server/server.js')

    const server = await createServer()
    await server.initialize()

    const resp = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(resp.headers['content-security-policy']).toBeUndefined()

    await server.stop({ timeout: 0 })
  })
})

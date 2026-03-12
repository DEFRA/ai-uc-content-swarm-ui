import nock from 'nock'

function setupNock () {
  nock.cleanAll()
  nock.disableNetConnect()
}

function teardownNock () {
  nock.cleanAll()
  nock.enableNetConnect()
}

function cleanupMocks () {
  nock.cleanAll()
}

export {
  setupNock,
  teardownNock,
  cleanupMocks
}

/**
 * Mock responses for runtime API
 * Used with nock for HTTP mocking in tests
 */

export const mockRuns = {
  success: {
    id: 'run-123-abc',
    name: 'Test Guidance Run',
    status: 'created',
    createdAt: '2026-03-09T10:00:00Z'
  },
  anotherSuccess: {
    id: 'run-456-def',
    name: 'Another Run',
    status: 'created',
    createdAt: '2026-03-09T11:00:00Z'
  }
}

export const mockContexts = {
  empty: [],
  withDocuments: [
    {
      id: 'ctx-001',
      filename: 'document.pdf',
      status: 'complete',
      uploadedAt: '2026-03-09T10:15:00Z'
    },
    {
      id: 'ctx-002',
      filename: 'reference.doc',
      status: 'complete',
      uploadedAt: '2026-03-09T10:20:00Z'
    }
  ]
}

export const mockUploadSession = {
  success: {
    upload_id: 'upload-789-xyz',
    runId: 'run-123-abc',
    status: 'initiated',
    initiatedAt: '2026-03-09T10:30:00Z'
  }
}

export const mockErrors = {
  serverError: {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  },
  badRequest: {
    error: 'Bad Request',
    message: 'Invalid request payload'
  },
  notFound: {
    error: 'Not Found',
    message: 'Run not found'
  }
}

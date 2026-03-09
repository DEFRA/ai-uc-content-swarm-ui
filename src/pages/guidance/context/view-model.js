/**
 * Convert Joi validation errors to template error format
 * Converts `[{ path: ['title'], message: '...' }]` to `{ title: '...' }`
 *
 * @param {Object} joiError - Joi ValidationError object
 *
 * @returns {Object} Error object keyed by field name
 */
function formatValidationErrors (joiError) {
  const errors = {}
  joiError.details.forEach(detail => {
    const field = detail.context.key
    errors[field] = detail.message
  })
  return errors
}

/**
 * Build the view data for the context-collect page
 *
 * @param {Object} options - View model options
 * @param {Object} options.run - The run object from the API
 * @param {Object} [options.errors] - Validation errors object
 *
 * @returns {Object} The view data object
 */
function buildContextCollectView ({ run, errors }) {
  return {
    run,
    ...(errors && { errors })
  }
}

export {
  formatValidationErrors,
  buildContextCollectView
}

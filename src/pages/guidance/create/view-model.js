/**
 * Convert Joi validation errors to template error format
 * Converts `[{ path: ['runName'], message: '...' }]` to `{ runName: '...' }`
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
 * Build the view data for the create page
 *
 * @param {Object} options - View model options
 * @param {Object} [options.errors] - Validation errors object
 *
 * @returns {Object} The view data object
 */
function buildCreateView ({ errors }) {
  return {
    ...(errors && { errors })
  }
}

export {
  formatValidationErrors,
  buildCreateView
}

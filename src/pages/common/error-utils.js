/**
 * Convert Hapi validation error details into a field-keyed errors object
 *
 * @param {Error} error - The Hapi validation error object
 *
 * @returns {Object} Object with field paths as keys and error messages as values
 */
function extractValidationErrors (error) {
  const errors = {}

  for (const detail of error?.details ?? []) {
    errors[detail.path] = detail.message
  }

  return errors
}

export {
  extractValidationErrors
}

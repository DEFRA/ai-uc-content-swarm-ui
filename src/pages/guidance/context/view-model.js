/**
 * Build the view data for the context-collect page
 *
 * @param {Object} options - View model options
 * @param {Object} options.run - The run object from the API
 * @param {Object} [options.errors] - Validation errors object
 *
 * @returns {Object} The view data object
 */
function ContextViewModel ({ run, errors } = {}) {
  return { run, errors }
}

export {
  ContextViewModel
}

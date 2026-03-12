/**
 * Build the view data for the create page
 *
 * @param {Object} options - View model options
 * @param {Object} [options.errors] - Validation errors object
 *
 * @returns {Object} The view data object
 */
function createNewRunViewModel ({ errors } = {}) {
  return { errors }
}

export {
  createNewRunViewModel
}

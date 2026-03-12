/**
 * Build the view data for the setup page
 *
 * @param {Object} options - View model options
 * @param {Object} options.run - The run object from the API
 * @param {Array} options.contexts - List of contexts for this run
 *
 * @returns {Object} The view data object
 */
function createSetupViewModel ({ run, contexts } = {}) {
  return { run, contexts }
}

export {
  createSetupViewModel
}

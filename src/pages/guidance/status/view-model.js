/**
 * Build the view data for the review page
 *
 * @param {Object} options - View model options
 * @param {Object} options.run - The run object from the API
 * @param {Array} options.contexts - List of contexts for this run
 *
 * @returns {Object} The view data object
 */
function createStatusViewModel ({ run, contexts } = {}) {
  const allComplete = contexts.length > 0 && contexts.every((c) => c.status === 'complete')
  return { run, contexts, allComplete }
}

export {
  createStatusViewModel
}

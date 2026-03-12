/**
 * Build the view data for the upload page
 *
 * @param {Object} options - View model options
 * @param {Object} options.run - The run object from the API
 * @param {string} options.uploadAction - The form action URL for upload
 *
 * @returns {Object} The view data object
 */
function createUploadViewModel ({ run, uploadAction } = {}) {
  return { run, uploadAction }
}

export {
  createUploadViewModel
}

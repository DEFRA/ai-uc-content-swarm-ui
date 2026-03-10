import Joi from 'joi'

/**
 * Joi schema for create run payload
 */
const createRunSchema = Joi.object({
  runName: Joi.string()
    .required()
    .trim()
    .min(1)
    .messages({
      'string.empty': 'Run name is required',
      'any.required': 'Run name is required',
      'string.min': 'Run name is required'
    })
})

export {
  createRunSchema
}

function validate (payload) {
  const { error, value } = createRunSchema.validate(payload, { abortEarly: false, allowUnknown: false })
  if (!error) return [value, null]

  const errors = {}
  error.details.forEach(detail => {
    const field = detail.context.key
    errors[field] = detail.message
  })

  return [null, errors]
}

export { validate }

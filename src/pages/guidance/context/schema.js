import Joi from 'joi'

/**
 * Joi schema for context metadata payload
 */
const metadataSchema = Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Document title is required',
      'any.required': 'Document title is required'
    }),
  description: Joi.string()
    .optional()
    .trim()
    .allow('')
})

function validate (payload) {
  const { error, value } = metadataSchema.validate(payload, { abortEarly: false, allowUnknown: false })

  if (!error) {
    return [value, null]
  }

  const errors = {}

  error.details.forEach(detail => {
    const field = detail.context.key
    errors[field] = detail.message
  })

  return [null, errors]
}

export {
  metadataSchema,
  validate
}

import Joi from 'joi'

const EMPTY_RUN_MESSAGE = 'Run name is required'

/**
 * Joi schema for create run payload
 */
const createRunSchema = Joi.object({
  runName: Joi.string()
    .required()
    .trim()
    .min(1)
    .messages({
      'string.empty': EMPTY_RUN_MESSAGE,
      'any.required': EMPTY_RUN_MESSAGE,
      'string.min': EMPTY_RUN_MESSAGE
    })
})

function validate (payload) {
  const { error, value } = createRunSchema.validate(payload, { abortEarly: false, allowUnknown: false })

  if (!error) {
    return [value, null]
  }

  const errors = {}

  for (const detail of error.details) {
    const field = detail.context.key

    errors[field] = detail.message
  }

  return [null, errors]
}

export {
  createRunSchema,
  validate
}

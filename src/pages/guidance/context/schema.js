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

export {
  metadataSchema
}

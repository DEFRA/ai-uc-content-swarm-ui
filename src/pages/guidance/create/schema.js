import Joi from 'joi'

/**
 * Joi schema for create run payload
 */
const createRunSchema = Joi.object({
  runName: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Run name is required',
      'any.required': 'Run name is required'
    })
})

export {
  createRunSchema
}

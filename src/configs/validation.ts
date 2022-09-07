import * as Joi from "joi";

/**
 * Validations => env variables
 */
export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  HTTP_BASIC_USERNAME: Joi.string().required(),
  HTTP_BASIC_PASSWORD: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});

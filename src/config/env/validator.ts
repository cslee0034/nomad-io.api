import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  SERVER_NAME: Joi.string().required(),
  API_PROTOCOL: Joi.string().required(),
  API_HOST: Joi.string().required(),
  API_PORT: Joi.number().required(),
  CLIENT_URL: Joi.string().required(),
  HTTP_TIMEOUT: Joi.number().required(),
  HTTP_MAX_REDIRECTS: Joi.number().required(),
  RDB_URL: Joi.string().required(),
  CACHE_URL: Joi.string().required(),
  CACHE_PASSWORD: Joi.string().required(),
  LOCK_URL: Joi.string().required(),
  LOCK_PASSWORD: Joi.string().required(),
  LOCK_WAIT: Joi.number().required(),
  LOCK_MAX_ATTEMPTS: Joi.number().required(),
  LOCK_IGNORE_UNLOCK_FAIL: Joi.boolean().required(),
  ENCRYPT_SALT: Joi.number().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_PREFIX: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  SLACK_WEBHOOK_URL: Joi.string().required(),
});

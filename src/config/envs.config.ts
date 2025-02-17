import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  SERVER_PORT: number;
  SERVER_HOST: string;
  SERVICE_USER_NAME: string;
  SERVICE_USER_HOST: string;
  SERVICE_USER_PORT: number;
}

const schema = joi
  .object({
    SERVER_PORT: joi.number().required(),
    SERVER_HOST: joi.string().required(),
    SERVICE_USER_NAME: joi.string().required(),
    SERVICE_USER_HOST: joi.string().required(),
    SERVICE_USER_PORT: joi.number().required(),
  })
  .unknown(true);

const data = schema.validate(process.env);

if (data.error) {
  throw new Error(`Config validation error: ${data.error.message}`);
}

export const {
  SERVER_PORT,
  SERVER_HOST,
  SERVICE_USER_NAME,
  SERVICE_USER_HOST,
  SERVICE_USER_PORT,
} = data.value as Envs;

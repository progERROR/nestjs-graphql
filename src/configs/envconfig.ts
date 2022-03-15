import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config';

const config: ConfigModuleOptions = {
  validationSchema: Joi.object({
    PORT: Joi.number(),
    DOMAIN: Joi.string(),

    JWT_SECRET: Joi.string(),
    JWT_EXPIRATION_TIME: Joi.number(),
  }),
};

export = config;

'use strict';

const logger = require('pino')();
const Joi = require('@hapi/joi');

const validator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (!error) {
      next();
    } else {
      logger.error(error);
      const errors = error.details.map((err) => err.message);

      res.status(400).json({ errors: errors });
    }
  };
};

module.exports = validator;

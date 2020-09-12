'use strict';

const Joi = require('joi');

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
});

const updateSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

module.exports = {
  createSchema,
  updateSchema,
};

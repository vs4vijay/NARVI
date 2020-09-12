#!/usr/bin/env node
'use strict';

const express = require('express');
const logger = require('pino')();

const config = require('./config');
const { db } = require('./db');
const { UserSchemas } = require('./schemas');
const { validator } = require('./middlewares');
const { HealthCheckController, UsersController } = require('./controllers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Service is Running',
  });
});

app.get(`${config['BASE_PATH']}/healthz`, HealthCheckController.healthCheck);

const usersRouter = express.Router();
usersRouter.get('/', UsersController.getAll);
usersRouter.get('/:id', UsersController.get);
usersRouter.post('/', validator(UserSchemas.createSchema), UsersController.create);
usersRouter.put('/:id', validator(UserSchemas.updateSchema), UsersController.update);
usersRouter.delete('/:id', UsersController.delete);
app.use(`${config['BASE_PATH']}/users`, usersRouter);

// Handle 404 Routes
app.get('*', (req, res) => {
  res.status(404).json({
    message: 'Resource not found',
  });
});

// Error Handler
app.use(function (error, req, res, next) {
  logger.error(error.stack, error.message);

  switch (error.name) {
    // Handle MongoDB Validation Error
    case 'ValidationError':
      const errors = [];
      for (let field in error.errors) {
        errors.push(error.errors[field].message);
      }
      const response = {
        errors: errors,
      };
      res.status(400).json(response);
      break;

    default:
      res.status(500).json({ errors: error.stack });
      break;
  }
});

if (require.main == module) {
  app.listen(config['PORT'], () => {
    logger.info(`Service has started on port ${config['PORT']}`);
  });
}

process.on('SIGINT', () => {
  db.close(() => {
    logger.info('db is closing due to SIGINT');
  });
  process.exit(0);
});

module.exports = {
  app,
};

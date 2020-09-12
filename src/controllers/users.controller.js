'use strict';

const logger = require('pino')();

const { UserService } = require('../services');

const userService = new UserService();

class UsersController {
  constructor() {}

  static async create(req, res, next) {
    logger.info(req.body);
    let createdUser;

    try {
      createdUser = await userService.create(req.body);
    } catch (error) {
      logger.error(error);
      next(error);
    }

    const response = {
      data: createdUser,
    };
    res.status(201).json(response);
  }

  static async get(req, res, next) {
    let foundUser;

    try {
      foundUser = await userService.get(req.params.id);
    } catch (error) {
      return res.status(404).json({ errors: [ 'user not found' ] });
    }

    const response = {
      data: foundUser,
    };
    res.json(response);
  }

  static async getAll(req, res, next) {
    const response = {
      data: await userService.getAll(),
    };
    res.json(response);
  }

  static async update(req, res, next) {
    let updatedUser;

    try {
      updatedUser = await userService.update(req.params.id, req.body);
    } catch (error) {
      return res.status(404).json({ errors: [ 'user not found' ] });
    }

    const response = {
      data: updatedUser,
    };
    res.json(response);
  }

  static async delete(req, res, next) {
    logger.info(req.body);

    try {
      await userService.delete(req.params.id);
    } catch (error) {
      return res.status(404).json({ errors: [ 'user not found' ] });
    }

    res.status(204);
  }
}

module.exports = {
  UsersController,
};

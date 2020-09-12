'use strict';

const { User } = require('../models');

class UserService {
  constructor() {}

  create(userBody) {
    return User.create(userBody);
  }

  get(id) {
    return User.findById(id);
  }

  getAll() {
    return User.find();
  }

  update(id, userBody) {
    return User.findByIdAndUpdate(id, userBody);
  }

  delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = UserService;

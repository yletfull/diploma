const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequest } = require('../errors/BadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

const users = require('../models/user');

const getUser = (req, res, next) => {
  users.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      } else {
        const err = new NotFoundError(`Пользователя с id:'${req.user._id}' не существует`);
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id'));
      }
      const error = err;
      error.statusCode = 500;
      return next(error);
    });
};
const register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      users.create({
        name, email, password: hash,
      })
        .then(() => res.status(200).send({
          name, email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = err;
            error.statusCode = 400;
            return next(error);
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            let error = err;
            error = new Error('Email уже используется');
            error.statusCode = 409;
            return next(error);
          }
          const error = err;
          error.statusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = err;
      error.statusCode = 400;
      next(error);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      const error = err;
      error.statusCode = 401;
      next(error);
    });
};

module.exports = {
  getUser,
  register,
  login,
};

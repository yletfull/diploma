/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NotFoundError } = require(path.join(__dirname, '../errors/NotFoundError'));
const { BadRequest } = require(path.join(__dirname, '../errors/BadRequest'));

const { NODE_ENV, JWT_SECRET } = process.env;

const user = require(path.join(__dirname, '../models/user'));

const getUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
      } else {
        err = new NotFoundError(`Пользователя с id:'${req.user._id}' не существует`);
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id'));
      }
      err.statusCode = 500;
      next(err);
    });
};
const register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      user.create({
        name, email, password: hash,
      })
        .then(() => res.status(200).send({
          name, email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            err.statusCode = 400;
            return next(err);
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            err = new Error('Email уже используется');
            err.statusCode = 409;
            return next(err);
          }
          err.statusCode = 500;
          next(err);
        });
    })
    .catch((err) => {
      err.statusCode = 400;
      next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  user.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      err.statusCode = 401;
      next(err);
    });
};

module.exports = {
  getUser,
  register,
  login,
};

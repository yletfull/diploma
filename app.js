require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');

const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require(path.join(__dirname, './middlewares/logger'));
const auth = require(path.join(__dirname, './middlewares/auth'));
const { register, login } = require(path.join(__dirname, './controllers/user'));
const article = require(path.join(__dirname, './routes/article'));
const user = require(path.join(__dirname, './routes/user'));

const {
  resourseError, timeLog, errorProcessor,
} = require(path.join(__dirname, '/routes/helpers.js'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use('', timeLog);
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);
app.use('',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required().pattern(/^Bearer\s[^\s]+$/),
    }).unknown(true),
  }),
  auth);
app.use(article);
app.use(user);
app.use(errorLogger);
app.use(errors());
app.use(resourseError);
app.use(errorProcessor);
module.exports = { app };

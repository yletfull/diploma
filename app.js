require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { register, login } = require('./controllers/user');
const { article, user } = require('./routes/index');
const { resourseError, errorProcessor } = require('./routes/helpers.js');

const BASE_URL = process.env.REACT_APP_BASE_URL;
const whitelist = [BASE_URL, 'http://107.172.142.144', 'http://107.172.142.144/', 'http://107.172.142.144:80'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// Маршруты для аутентификации
app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);

// Защищенные маршруты
app.use(auth);
app.use('/api', article);
app.use('/api', user);

app.use(errors());
app.use(resourseError);
app.use(errorProcessor);
app.use(errorLogger);

module.exports = { app };

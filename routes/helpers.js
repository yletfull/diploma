/* eslint-disable no-console */

const { NotFoundError } = require('../errors/NotFoundError');

const errorProcessor = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  next(err);
};

const resourseError = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

const timeLog = (req, res, next) => {
  const date = new Date();
  console.log(`${date}, URL:${req.url}, Method:${req.method}`);
  next();
};

module.exports = {
  resourseError,
  timeLog,
  errorProcessor,
};

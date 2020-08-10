/* eslint-disable no-console */
const path = require('path');

const { NotFoundError } = require(path.join(__dirname, '../errors/NotFoundError'));
// eslint-disable-next-line no-unused-vars
const errorProcessor = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
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

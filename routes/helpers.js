const { NotFoundError } = require('../errors/NotFoundError');

const errorProcessor = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
  next(err);
};

const resourseError = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

module.exports = {
  resourseError,
  errorProcessor,
};

const articles = require('../models/article');

const { NotFoundError } = require('../errors/NotFoundError');
const { NoAccess } = require('../errors/NoAccess');
const { BadRequest } = require('../errors/BadRequest');

const getArticles = (req, res, next) => {
  articles.find({})
    .populate('owner')
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      const error = err;
      error.statusCode = 500;
      return next(error);
    });
};

const addArticle = (req, res, next) => {
  const {
    keyword, title, text, source, link, image,
  } = req.body;
  const owner = req.user._id;
  articles.create({
    keyword, title, text, source, link, image, owner,
  })
    .then((article) => res.status(200).send({ article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = err;
        error.statusCode = 400;
        return next(error);
      }
      const error = err;
      error.statusCode = 500;
      return next(error);
    });
};

const removeArticle = (req, res, next) => {
  articles.findById(req.params.articleId)
    .then((article) => {
      if (article) {
        if (String(article.owner) === String(req.user._id)) {
          articles.findByIdAndRemove(req.params.articleId)
            .then(res.status(200).send({ article }))
            .catch((err) => {
              const error = err;
              error.statusCode = 500;
              return next(error);
            });
        } else {
          const err = new NoAccess('Нет доступа');
          next(err);
        }
      } else {
        const err = new NotFoundError('Такой новости не существует');
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

module.exports = {
  getArticles,
  addArticle,
  removeArticle,
};

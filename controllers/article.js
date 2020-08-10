/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const path = require('path');

const article = require(path.join(__dirname, '../models/article'));

const { NotFoundError } = require(path.join(__dirname, '../errors/NotFoundError'));
const { NoAccess } = require(path.join(__dirname, '../errors/NoAccess'));
const { BadRequest } = require(path.join(__dirname, '../errors/BadRequest'));

const getArticles = (req, res, next) => {
  article.find({})
    .populate('owner')
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const addArticle = (req, res, next) => {
  const {
    keyword, title, text, source, link, image,
  } = req.body;
  const owner = req.user._id;
  article.create({
    keyword, title, text, source, link, image, owner,
  })
    .then((article) => res.status(200).send({ article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = 400;
        return next(err);
      }
      err.statusCode = 500;
      next(err);
    });
};

const removeArticle = (req, res, next) => {
  article.findById(req.params.articleId)
    .then((art) => {
      if (art) {
        // eslint-disable-next-line eqeqeq
        if (art.owner == req.user._id) {
          article.findByIdAndRemove(req.params.articleId)
            .then(res.status(200).send({ art }))
            .catch((err) => {
              err.statusCode = 500;
              next(err);
            });
        } else {
          err = new NoAccess('Нет доступа');
          next(err);
        }
      } else {
        err = new NotFoundError('Такой новости не существует');
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

module.exports = {
  getArticles,
  addArticle,
  removeArticle,
};

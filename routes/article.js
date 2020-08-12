const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { default: validator } = require('validator');
const {
  getArticles,
  addArticle,
  removeArticle,
} = require('../controllers/article');

router.get('/articles', getArticles);

router.post('/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required().min(2).max(30),
      title: Joi.string().required().min(2).max(30),
      text: Joi.string().required().min(2).max(30),
      source: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Некорректная ссылка');
      }),
      image: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Некорректная ссылка на изображение');
      }),
      date: Joi.string().isoDate(),
    }),
  }),
  addArticle);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().required().min(24)
      .max(24),
  }),
}), removeArticle);

module.exports = router;

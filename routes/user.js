const router = require('express').Router();
const path = require('path');
// const { celebrate, Joi } = require('celebrate');

const {
  getUser,
} = require(path.join(__dirname, '../controllers/user'));

router.get('/users/me', getUser);

module.exports = router;

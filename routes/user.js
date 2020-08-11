const router = require('express').Router();

const {
  getUser,
} = require('../controllers/user');

router.get('/users/me', getUser);

module.exports = router;

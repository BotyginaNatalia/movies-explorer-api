const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  updateUserInfo, getUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = router;

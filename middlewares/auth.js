const jwt = require('jsonwebtoken');
const { AuthErr } = require('../errors/AuthErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'default-secret-secret');
  } catch (error) {
    throw new AuthErr('Необходима авторизация');
  }
  req.user = payload;
  next();
};

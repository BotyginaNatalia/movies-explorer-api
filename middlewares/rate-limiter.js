const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1000 * 60 * 10000,
  max: 100000,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;

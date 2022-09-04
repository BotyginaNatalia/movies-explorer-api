require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const { login, createNewUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NotFoundErr } = require('./errors/NotFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(helmet());

const corsOptions = {
  origin: [
    'https://api.movie.nb.nomoredomains.sbs',
    'http://api.movie.nb.nomoredomains.sbs',
    'https://movie.nb.nomoredomains.sbs',
    'http://movie.nb.nomoredomains.sbs',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
  ],
  optionsSuccessStatus: 200,
  methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
};

app.use(cors(corsOptions));

app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createNewUser,
);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundErr('Маршрут не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Произошла ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);

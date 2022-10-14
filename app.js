require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { NotFoundErr } = require('./errors/NotFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');

const { PORT = 3000, NODE_ENV, SERVER_DB } = process.env;
const app = express();
app.use(express.json());
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
  optionsSuccessStatus: 204,
  methods: ['GET, PUT, POST, DELETE, PATCH, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? SERVER_DB : 'mongodb://127.0.0.1:27017/moviesdb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/index'));

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

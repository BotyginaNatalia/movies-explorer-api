const Movie = require('../models/movie');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { ForbiddenErr } = require('../errors/ForbiddenErr');
const { Created } = require('../errors/Created');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({ owner: req.user._id });
    res.send(movie);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.createNewMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(Created).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Введены некорректные данные'));
      }
      next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundErr('Фильм с данным id не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenErr('Нельзя удалить чужой фильм'));
      }
      return movie
        .remove()
        .then(() => res.send({ message: 'Фильм успешно удален' }));
    })
    .catch(next);
};

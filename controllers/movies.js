const Movie = require('../models/movie');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { InternalErr } = require('../errors/InternalErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { ForbiddenErr } = require('../errors/ForbiddenErr');
const { Created } = require('../errors/Created');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.send(movie);
  } catch (error) {
    next(new InternalErr('Произошла ошибка на сервере'));
  }
};

module.exports.createNewMovie = async (req, res, next) => {
  try {
    const movie = new Movie({
      country: req.body.country,
      director: req.body.director,
      duration: req.body.duration,
      year: req.body.year,
      description: req.body.description,
      image: req.body.image,
      trailerLink: req.body.trailerLink,
      thumbnail: req.body.thumbnail,
      owner: req.user._id,
      movieId: req.movie._id,
      nameRU: req.body.name,
      nameENG: req.body.name,
    });
    await movie.save();
    res.status(Created).send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestErr('Введены некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundErr('Карточка с данным id не найдена'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenErr('Нельзя удалить чужую карточку'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

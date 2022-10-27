const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { ConflictErr } = require('../errors/ConflictErr');
const { Created } = require('../errors/Created');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(new ConflictErr('Пользователь с данным email уже существует'));
  }
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    });
    user.password = await user.hashPass(req.body.password);
    await user.save();
    res.status(Created).send({
      data: {
        name: user.name, email: user.email,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestErr('Введены некорректные данные'));
    } else if (error.code === 11000) {
      next(new ConflictErr('Пользователь с данным email уже существует'));
    } else {
      next(error);
    }
  }
};

module.exports.updateUserInfo = (req, res, next) => {
  const userInfo = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(userInfo, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) next(new NotFoundErr('Пользователь с указанным id не найден'));
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Введены некорректные данные'));
      } else if (error.code === 11000) {
        next(new ConflictErr('Пользователь с данным email уже существует'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'default-secret-secret', { expiresIn: '30d' });
      return res.send({ token });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы успешно вышли из приложения' });
};

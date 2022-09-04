const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 10,
  },

  year: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 4,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(URL) {
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\\+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/i.test(URL);
      },
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(URL) {
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\\+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/i.test(URL);
      },
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(URL) {
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\\+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/i.test(URL);
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },

  nameENG: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);

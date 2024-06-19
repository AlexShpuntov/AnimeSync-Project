const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
  genre: {
    type: [String]
  },
  episodes: {
    type: Number
  },
  studio: {
    type: [String]
  },
  year: {
    type: [String]
  }
});

const commentsSchema = new mongoose.Schema({
  commenter: {
    type: String
  },
  text: {
    type: String
  },
  rating: {
    type: Number,
    default: null
  }
});

const AnimeSchema = new mongoose.Schema({
  title: {
    type: String
  },
  imageUrl: {
    type: String,
    contentType: 'image/jpg'
  },
  overview: {
    type: String
  },
  details: {
    type: [detailsSchema]
  },
  trailerUrl: {
    type: String,
    required: false
  },
  ratings: {
    type: [Number]
  },
  comments: {
    type: [commentsSchema]
  }
});

AnimeSchema.methods.calculateAverageRating = function() {
  const commentsWithRatings = this.comments.filter(comment => comment.rating !== null && comment.rating !== undefined);
  const totalRating = commentsWithRatings.reduce((acc, cur) => acc + cur.rating, 0);
  const averageRating = totalRating / commentsWithRatings.length;
  this.ratings = isNaN(averageRating) ? null : averageRating;
};

AnimeSchema.pre('save', async function(next) {
  if (this.isModified('comments') || this.isNew) {
    this.calculateAverageRating();
  }
  next();
});

const AnimeList = mongoose.model('Anime', AnimeSchema);

module.exports = AnimeList;
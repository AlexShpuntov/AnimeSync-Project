const AnimeList = require('../models/AnimeList');
const UserAccount = require('../models/UserAccount');

let animeId;

exports.getAnimeList = async (req, res) => {
  try {
    const sampleSize = 6;
    const animeResponse = await AnimeList.aggregate([{ $sample: { size: sampleSize } }]);
    const anime = animeResponse.map(anime => ({
      _id: anime._id,
      title: anime.title,
      imageUrl: anime.imageUrl
    }));
    let liked = [];
    if (res.locals.user) {
      const user = await UserAccount.findById(res.locals.user._id);
      if (user && user.liked.length > 0) {
        liked = await AnimeList.find({
          _id: { $in: user.liked }
        }).select('_id title imageUrl');
      }
    }
    res.render('main', { anime, liked });
  } catch (error) {
    res.status(500).json({ message: "Error getting list of Anime" });
  }
};

exports.getAnimeInfoById = async (req, res) => {
  const userId = res.locals.user._id;
  try {
    animeId = req.query.id;
    const anime = await AnimeList.findById(animeId);
    const user = await UserAccount.findById(userId);
    const isFavorite = user.liked.includes(animeId);
    const commentReviews = anime.comments;
    const trailerUrl = anime.trailerUrl;
    res.render('anime-information', { anime, isFavorite, commentReviews, trailerUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error getting information for the Anime' });
  }
};

exports.searchAnimeByName = async (req, res) => {
  try {
    const animeTitle = req.query.title;
    const regex = new RegExp(animeTitle, 'i');
    const animeData = await AnimeList.find({ title: { $regex: regex } });
    const anime = animeData.map(anime => ({
      _id: anime._id,
      title: anime.title,
      imageUrl: anime.imageUrl
    }));  
    res.render('search', { anime });
  } catch (error) {
    res.status(500).json({ message: 'Error getting anime' });
  }
};

exports.postingComment = async (req, res) => {
  try {
    const text = req.body.comment;
    const commenter = res.locals.user.name;
    const rating = req.body.rating;
    const anime = await AnimeList.findById(animeId);
    if (!anime) {
      return res.status(404).send('Anime not found');
    }
    anime.comments.push({ commenter, text, rating });
    await anime.save();
    await anime.calculateAverageRating();
    res.status(201).json({ anime });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.getAddingAnime = async (req, res) => {
  try {
    res.render('add-anime', {edit: false });
  } catch (error) {
    res.status(500).json({ message: 'Error getting Add-anime page' });
  }
};

exports.postAddingAnime = async (req, res) => {
  const { animeTitle, animeImage, animeOverview, detailGenre, detailEpisodes, detailStudio, detailReleaseDate, animeTrailer } = req.body;
  try {
    const anime = {
      title: animeTitle,
      imageUrl: animeImage,
      overview: animeOverview,
      trailerUrl: animeTrailer,
      details: {
        genre: detailGenre,
        episodes: detailEpisodes,
        studio: detailStudio,
        year: detailReleaseDate
    }};
    const result = await AnimeList.insertMany(anime);
    res.status(201).redirect(`/anime-info?id=${ result[0]._id }`);
  } catch (error) {
    res.status(500).json({ message: 'Error posting anime' });
  }
};

exports.getEditingAnime = async (req, res) => {
  try {
    const anime = await AnimeList.findById(animeId);
    if (!anime) {
      return res.status(404).send('Anime not found');
    }
    res.render('add-anime', { edit: true, anime });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

exports.postEditingAnime = async (req, res) => {
  const { animeTitle, animeImage, animeOverview, detailGenre, detailEpisodes, detailStudio, detailReleaseDate, animeTrailer } = req.body;
  try {
    const anime = await AnimeList.updateOne(
      { _id: animeId },
      { $set: {
        title: animeTitle,
        imageUrl: animeImage,
        overview: animeOverview,
        trailerUrl: animeTrailer,
        details: {
          genre: detailGenre,
          episodes: detailEpisodes,
          studio: detailStudio,
          year: detailReleaseDate
      }}}
    );
    res.status(201).redirect(`/anime-info?id=${ animeId }`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.toggleFavorite = async (req, res) => {
  const userId = res.locals.user._id;
  const { animeId } = req.body;
  try {
    const user = await UserAccount.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const index = user.liked.indexOf(animeId);
    let isFavorite;

    if (index > -1) {
      user.liked.splice(index, 1);
      isFavorite = false;
    } else {
      user.liked.push(animeId);
      isFavorite = true;
    }
    await UserAccount.updateOne({ _id: userId }, { liked: user.liked });
    res.status(201).json({ success: true, isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAnimeList = async (req, res) => {
  try {
    const animeResponse =await AnimeList.find({})
    const anime = animeResponse.map(anime => ({
      _id: anime._id,
      title: anime.title,
      imageUrl: anime.imageUrl
    }));
    res.render('all', { anime });
  } catch (error) {
    res.status(500).json({ message: "Error getting list of Anime" });
  }
};
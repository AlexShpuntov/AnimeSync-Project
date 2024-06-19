const AnimeList = require('../models/AnimeList');
const axios = require('axios');

exports.downloadAnimeToDB = async function(req, res, next) {
  try {
    for (let page = 1; page <= 3; page++) {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?sfw=true&page=${page}`);
      const animeData = response.data;
      for (let i = 0; i < animeData.data.length; i++) {
        let anime = {
          title: animeData.data[i].title_english || animeData.data[i].title,
          imageUrl: animeData.data[i].images.jpg.large_image_url,
          overview: animeData.data[i].synopsis,
          details: {
            genre: animeData.data[i].genres.map(genre => genre.name),
            episodes: animeData.data[i].episodes,
            studio: animeData.data[i].studios.map(studio => studio.name),
            year: animeData.data[i].year || animeData.data[i].aired.prop.from.year
          },
          trailerUrl: animeData.data[i].trailer.embed_url
        };
      try {
        const result = await AnimeList.insertMany(anime);
        console.log(result);
      } catch (error) {
        console.error('Error creating anime list:', error);
      }
    }};
  res.redirect('/');
  } catch (error) {
    console.error('Error fetching anime:', error);
    next(error);
  }
};

exports.listOfAnime = async (req, res) => {
  const data = await AnimeList.find({})
  res.json(data);
};
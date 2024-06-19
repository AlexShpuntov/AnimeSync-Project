const express = require('express');
const router = express.Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const animeController = require('../controllers/animeController');
const downloadController = require('../controllers/animeDownloadingController');
const accountController = require('../controllers/accountController');

router.get('*', checkUser);
router.get('/', animeController.getAnimeList);
router.get('/anime-info', requireAuth, animeController.getAnimeInfoById);
router.get('/search', animeController.searchAnimeByName);
router.get('/all', animeController.getAllAnimeList);

router.get('/add', requireAuth, animeController.getAddingAnime);
router.post('/add', requireAuth, animeController.postAddingAnime);
router.get('/edit', requireAuth, animeController.getEditingAnime);
router.post('/edit', requireAuth, animeController.postEditingAnime);

router.post('/toggle-favorite', requireAuth, checkUser, animeController.toggleFavorite);
router.post('/anime-info', requireAuth, checkUser, animeController.postingComment);

router.get('/download', downloadController.downloadAnimeToDB)

router.get('/signup', accountController.getSignUpUser);
router.get('/login', accountController.getLoginUser);
router.post('/signup', accountController.postingSignup);
router.post('/login', accountController.postingLogin);
router.get('/logout', accountController.getLogoutUser);

module.exports = router;
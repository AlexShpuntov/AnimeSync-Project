const jwt = require('jsonwebtoken');
const UserAccounts = require('../models/UserAccount.js');

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.MY_SECRET, (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.redirect('/login')
      } else {
        console.log(decodedToken);
        next();
      }
    })
  } else {
    res.redirect('/login')
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.MY_SECRET, async (error, decodedToken) => {
      if (error) {
        console.log(error.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await UserAccounts.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
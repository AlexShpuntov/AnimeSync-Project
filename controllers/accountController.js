const UserAccount = require('../models/UserAccount.js');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', email: '', password: '' };
  if (err.message === 'Incorrect email') {
    errors.email = 'That email is not registered';
  }
  if (err.message === 'Incorrect password') {
    errors.password = 'That password is incorrect';
  }
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.MY_SECRET, { expiresIn: '1h' });
};

exports.getSignUpUser = (req, res) => {
  try {
    res.render('signup', { message: 'Hello' });
  } catch (error) {
    console.error('Error loading Sign Up page:', error);
  }
};

exports.getLoginUser = (req, res) => {
  try {
    res.render('login', { message: 'Hello' });
  } catch (error) {
    console.error('Error loading Login page:', error);
  }
};

exports.postingSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userData = await UserAccount.create({ name, email, password });
    const token = createToken(userData._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
    res.status(201).json({ user: userData._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

exports.postingLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserAccount.login(email, password);
    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 }); 
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

exports.getLogoutUser = async (req, res) => {
  res.cookie('token', '', { maxAge: 1 });
  res.redirect('/');
};
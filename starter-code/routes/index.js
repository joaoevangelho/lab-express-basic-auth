'use strict';

const {
  Router
} = require('express');
const router = Router();

const User = require('./../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Hello World!'
  });
});

// Sign Up
router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then(hash => {
      return User.create({
        username,
        passwordHash: hash
      });
    })
    .then(user => {
      console.log('Created user', user);
      req.session.user = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

// Sign In
router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let userId;
  const {
    email,
    password
  } = req.body;

  User.findOne({
      email
    })
    .then(user => {
      if (!user) {

        return Promise.reject(new Error("There's no user with that email."));
      } else {

        userId = user._id;
        return bcrypt.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect('/');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });

  // Sign Out
  router.post('/sign-out', (req, res, next) => {

    req.session.destroy();
    res.redirect('/');
  });
});














module.exports = router;
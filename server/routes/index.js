'use strict';

const express = require('express');
const knex = require('../../knex');
const router = express.Router();
const util = require('./util');

router.get('/', (_req, res, _next) => {
  res.redirect('/login');
});

router.get('/login', (_req, res, _next) => {
  res.render('login');
});

router.get('/signup', (_req, res, _next) => {
  res.render('signup');
});

router.get('/people/:username', util.authorize, (req, res, next) => {
  const username = req.params.username;
  let userId;

  knex('users')
    .where('username', username)
    .first()
    .then((user) => {
      userId = user.id;

      return util.getLists(username)
    })
    .then((lists) => {
      res.render('home', { lists, userId });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

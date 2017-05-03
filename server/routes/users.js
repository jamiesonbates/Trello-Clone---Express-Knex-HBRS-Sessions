'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../../knex');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/users', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 12)
    .then((h_pw) => {
      return knex('users').insert({
        username,
        h_pw
      }, '*');
    })
    .then((users) => {
      const user = users[0];
      const claim = { userId: user.id };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 30), // 30 days
        secure: router.get('env') === 'production'
      });

      delete user.h_pw;

      res.redirect(`/people/${user.username}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

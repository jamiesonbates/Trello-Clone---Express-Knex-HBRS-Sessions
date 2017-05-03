'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../../knex');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/token', (req, res, next) => {
  const { username, password } = req.body;
  let user;

  knex('users')
    .where('username', username)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = row;

      return bcrypt.compare(password, user.h_pw);
    })
    .then(() => {
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
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/token', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;

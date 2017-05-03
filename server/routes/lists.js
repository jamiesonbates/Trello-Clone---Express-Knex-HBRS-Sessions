'use strict';

const express = require('express');
const knex = require('../../knex');
const router = express.Router();
const util = require('./util');

router.post('/list/:id', (req, res, next) => {
  const user_id = req.params.id;
  const title = req.body.title;

  knex('lists')
    .insert({
      user_id,
      title
    })
    .then(() => {
      return util.getUserInfo(user_id);
    })
    .then((user) => {
      const username = user.username;

      res.redirect(`/people/${username}`)
    })
    .catch((err) => {
      next(err);
    })
});

router.delete('/list/:id', (req, res, next) => {
  const listId = req.params.id;
  const userId = req.body.userId;

  knex('lists')
    .del()
    .where('lists.id', listId)
    .then(() => {
      return util.getUserInfo(userId);
    })
    .then((user) => {
      const username = user.username;

      res.redirect(`/people/${username}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

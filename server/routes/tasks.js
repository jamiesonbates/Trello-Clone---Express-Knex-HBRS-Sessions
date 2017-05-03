'use strict';

const express = require('express');
const knex = require('../../knex');
const router = express.Router();
const util = require('./util');

router.post('/task', (req, res, next) => {
  const list_id = req.body.listId;
  const task = req.body.task;
  const userId = req.body.userId;

  knex('tasks')
    .insert({ list_id, task })
    .then(() => {
      return util.getUserInfo(userId);
    })
    .then((user) => {
      const username = user.username;

      res.redirect(`/people/${username}`);
    })
    .catch((err) => {
      next(err);
    })
});

router.put('/task/:id', (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.body.userId;
  const task = req.body.task;

  knex('tasks')
    .update('task', task)
    .where('id', taskId)
    .then(() => {
      return util.getUserInfo(userId);
    })
    .then((user) => {
      console.log('user', user);
      const username = user.username;

      res.redirect(`/people/${username}`);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/task/:id', (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.body.userId;

  knex('tasks')
    .del()
    .where('id', taskId)
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

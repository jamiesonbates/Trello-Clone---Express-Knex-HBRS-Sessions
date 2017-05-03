'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../../knex');
const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.claim = payload;

    next();
  });
}

function getUserInfo(userId) {
  return knex('users')
    .select('username', 'id')
    .where('id', userId)
    .first();
}

function getTasks(list) {
  const promise = new Promise((resolve, reject) => {
    knex('tasks')
    .where('list_id', list.listId)
    .orderBy('id')
    .returning('*')
    .then((tasks) => {
      const listObj = {
        id: list.listId,
        title: list.title,
        tasks
      }

      resolve(listObj);
    });
  });

  return promise;
}

function getLists(username) {
  return knex('lists')
    .select('lists.id as listId', 'lists.title as title')
    .innerJoin('users', 'users.id', 'lists.user_id')
    .where('users.username', username)
    .returning('*')
    .then((lists) => {
      const promises = [];

      for (const list of lists) {
        promises.push(getTasks(list));
      }

      return Promise.all(promises);
    })
    .then((lists) => {
      return lists;
    })
}

module.exports = {
  authorize,
  getUserInfo,
  getTasks,
  getLists
}

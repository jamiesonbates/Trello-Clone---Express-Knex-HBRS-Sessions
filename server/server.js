'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

const index = require('./routes/index');
const lists = require('./routes/lists');
const tasks = require('./routes/tasks');
const token = require('./routes/token');
const users = require('./routes/users');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(cookieParser());

app.use(index);
app.use(lists);
app.use(tasks);
app.use(token);
app.use(users);

app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
    .status(err.output.statusCode)
    .set('Content-Type', 'text/plain')
    .send(err.message);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: [
    'views/partials/'
  ]
}));

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, () => {
  console.log('Listening on port', port);
});


module.exports = app;

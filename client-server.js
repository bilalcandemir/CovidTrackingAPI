const express = require('express');
const app = express();
const routes = require('./client/indexRoutes');
const bodyParser = require('body-parser');
const Knex = require('knex');
const knexfile = require('./knexfile');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);
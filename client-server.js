const express = require('express');
const app = express();
const routes = require('./client/indexRoutes');
const bodyParser = require('body-parser');
//const fileUpload = require('express-fileupload'); For Upload Image
const Knex = require('knex');
const knexfile = require('./knexfile');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);
//app.use(fileUpload());

// For Upload Image
// app.post('/upload', async (req, res) => {
//   const {name, data} = req.files.pic;
//   await Knex.insert({id: 1, name: name, img: data}).into('denemeStorage');
//   res.status(200);
// })

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);
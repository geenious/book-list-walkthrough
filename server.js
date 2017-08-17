const express = require('express');
const mustacheExpress = require('mustache-express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(`${process.env.MONGODB_URI}`, { useMongoClient: true });

const Person = require('./models/person');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const mustache = mustacheExpress();
if (process.env.NODE_ENV ==='development') {
  mustache.cache = null;
}
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(express.static('public'));

app.get('/list', (req, res) => {
  res.render('list');
});

app.get('/book-form', (req, res) => {
  res.render('book-form');
});

app.get('/people', (req, res) => {
  Person.find({}, (err, people) => {
    res.json(people);
  });
});

app.post('/addperson', (req, res) => {
  const person = new Person();
  person.firstName = req.body.firstName;
  person.lastName = req.body.lastName;
  person.save((err, person) => {
    console.log('I created', person);
    res.redirect('/');
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

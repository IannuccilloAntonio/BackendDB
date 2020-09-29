var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
const mongoose = require('mongoose');

var port = process.env.PORT || 3000;


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(cors());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const mongoURI = 'mongodb://127.0.0.1:27017/application'
var MongoClient = require("mongodb").MongoClient;

mongoose.connect(mongoURI, 
  {useNewUrlParser: true})
  .then(() => console.log('MongoDB connected'))
  .catch((err)=> console.log('aaaaa ' + err))

var Users = require('./routes/Users')
var Books = require('./routes/Books')
app.use('/users', Users);
app.use('/books', Books);

app.set('json spaces', 2);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


  



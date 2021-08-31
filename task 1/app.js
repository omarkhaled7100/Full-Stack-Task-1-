const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const requests = require('request');
const axios = require('axios').default;

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb://netninja:test1234@cluster0-shard-00-00.sdxqj.mongodb.net:27017,cluster0-shard-00-01.sdxqj.mongodb.net:27017,cluster0-shard-00-02.sdxqj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bmlbw6-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(process.env.PORT || 3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/valoro', (req, res) => {

  var options = {
    method: 'GET',
    url: 'https://quotes15.p.rapidapi.com/quotes/random/',
    headers: {
      'x-rapidapi-host': 'quotes15.p.rapidapi.com',
      'x-rapidapi-key': 'f4948d3ccamsh3d4dfaada2d5a79p13d713jsn3b659d1008c7'
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
    res.render('Valoro', {
     content: response.data.content,
     
      title: 'Famous Quote..'
    } )
  }).catch(function (error) {
    console.error(error);
  });
  
});




// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
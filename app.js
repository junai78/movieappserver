const express = require('express');
const app = express();
const axios = require('axios');
const Film = require('./Film');
//const path = require('path'); //---heroku---
const cors = require('cors');
const apikey = '385e80';

const port = process.env.PORT || 2000;

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//localhost:5000/getfilm?title=MovieTitle
app.get('/getfilm', (req, res) => {
  const title = req.query.title;
  const querystr = `http://www.omdbapi.com/?t=${title}&apikey=${apikey}`;

  axios
    .get(querystr)
    .then(response => {
      const film = new Film({
        title: response.data.Title,
        year: response.data.Year,
        genre: response.data.Genre,
        actors: response.data.Actors,
        plot: response.data.Plot,
        poster: response.data.Poster
      });
      if (!film.title) {
        res.status(200).json('Not found');
        return;
      }
      film
        .save()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

//localhost:5000/getallmovies
app.get('/getallfilm', (req, res) => {
  Film.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:5000/deletefilm?title=MovieTitle
app.get('/deletefilm', (req, res) => {
  Film.deleteMany({ title: req.query.title })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

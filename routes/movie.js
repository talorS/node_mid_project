var express = require('express');
var router = express.Router();

const movieBL = require('../models/movieBL');
const usersBL = require('../models/usersBL');

//create movie
router.get('/createForm', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session["allowed_credits"] > req.session["used_credits"] || req.session["admin"]) {
      res.render('createMoviePage', { msg: '' });
    } else {
      req.app.set('msg', "You don't have enough credits for the current day");
      res.redirect('/logout');
    }
  } else res.redirect('/');
});

//search movies
router.get('/search', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session["allowed_credits"] > req.session["used_credits"] || req.session["admin"]) {
      const resp = await movieBL.getMoviesData();
      res.render('searchMoviesPage', {
        languages: resp.languages, genres: resp.genres,
        msg: req.app.get('msg') ? req.app.get('msg') : ''
      });
    } else {
      req.app.set('msg', "You don't have enough credits for the current day");
      res.redirect('/logout');
    }
  } else res.redirect('/');
});

router.post('/createForm/created', async function (req, res, next) {
  req.session["used_credits"]++;
  await usersBL.updateUserCredit(req.session["name"], req.session["used_credits"]);
  const resp = await movieBL.insetMovie(req.body);
  if (resp != '')
    res.render('createMoviePage', { msg: resp });
  else res.redirect('/menu');
});

router.post('/search/result', async function (req, res, next) {
  if (!req.body.name && !req.body.genre && !req.body.language) {
    req.app.set('msg', "At least one search criteria should be filled");
    res.redirect('/movie/search');
  }
  else {
    req.session["used_credits"]++;
    await usersBL.updateUserCredit(req.session.name, req.session["used_credits"]);
    const resp = await movieBL.searchMovies(req.body);
    res.render('searchResultPage', { data: resp });
  }
});

//show movie details
router.get('/:id', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session["allowed_credits"] > req.session["used_credits"] || req.session["admin"]) {
      req.session["used_credits"]++;
      await usersBL.updateUserCredit(req.session["name"], req.session["used_credits"]);
      let movie_id = req.params.id;
      let movieData = await movieBL.getMovie(movie_id);
      res.render('MovieDataPage', { data: movieData });
    } else {
      req.app.set('msg', "You don't have enough credits for the current day");
      res.redirect('/logout');
    }
  } else res.redirect('/');

});

module.exports = router;

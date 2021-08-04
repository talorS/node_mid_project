var express = require('express');
var router = express.Router();

const loginBL = require('../models/loginBL');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('loginPage', { msg: req.app.get('msg') ? req.app.get('msg') : '' });
});

router.post('/login', async function (req, res, next) {
  const result = await loginBL.checkCredentials(req.body);
  if (result.msg != '')
    res.render('loginPage', { msg: result.msg });
  else {
    req.session["logged"] = true;
    req.session["admin"] = result.admin;
    req.session["used_credits"] = result.used;
    req.session["allowed_credits"] = result.credits;
    req.session["name"] = result.name;
    res.redirect('/menu');
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

const usersBL = require('../models/usersBL');

//edit users
router.get('/edit', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session.admin) {
      const resp = await usersBL.getUsers();
      res.render('editUsersPage', { users: resp, msg: req.app.get('msg') ? req.app.get('msg') : '' });
    } else res.redirect('/menu');
  } else res.redirect('/');
});

//delete user
router.get('/delete/:username', async function (req, res, next) {
  if (req.session["logged"]) {
    const username = req.params.username;
    const resp = await usersBL.deleteUser(username);
    req.app.set('msg', resp);
    res.redirect('/users/edit');
  } else res.redirect('/');
});

//add new user
router.get('/userData', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session.admin) {
      res.render('userDataPage', { msg: '' });
    } else res.redirect('/menu');
  } else res.redirect('/');
});

router.post('/insert', async function (req, res, next) {
    const obj = {
      username :req.body.username,
      password : req.body.pwd,
      created_date : new Date(req.body.created).toLocaleDateString(),
      num_of_transactions : Number(req.body.credits),
      operations: {
        used: 0,
        date: new Date().toLocaleDateString()
      },
      admin : Boolean(req.body.admin)
    };
    
    const resp = await usersBL.addUser(obj);
    res.render('userDataPage', { msg: resp });
});

//update exist user
router.get('/userData/:user', async function (req, res, next) {
  if (req.session["logged"]) {
    if (req.session.admin) {
      const userData = JSON.parse(req.params.user);
      res.render('userDataPage', { user: userData, msg: '' });
    } else res.redirect('/menu');
  } else res.redirect('/');
});

router.post('/update', async function (req, res, next) {
  const obj = {
    username :req.body.username,
    password : req.body.pwd,
    created_date : req.body.created,
    num_of_transactions : Number(req.body.credits),
    operations: {
      used: Number(req.body.op_used),
      date: req.body.op_date
    },
    admin : Boolean(req.body.admin)
  }; 
  const resp = await usersBL.updateUser(obj);
  res.render('userDataPage', {user: obj, msg: resp });
});

module.exports = router;

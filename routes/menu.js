var express = require('express');
var router = express.Router();

//default
router.get('/',async function(req, res, next) {
  if(req.session["logged"]){
    res.render('menuPage', {admin : req.session["admin"], name : req.session["name"]});
  } else res.redirect('/');
});

module.exports = router;

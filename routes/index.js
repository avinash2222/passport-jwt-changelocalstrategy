var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '👶 Connected to backend Microservice Dashboard server...' });
});


module.exports = router;

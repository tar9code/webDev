var express = require('express');
var router = express.Router();

/* GET home page. */
var controllerMongoCollection = require('../controllers/database');
//load controller code dealing with database mongodb and Routes collection

//MAY HAVE OTHER CODE in index.js


//CODE to route /getAllRoutes to appropriate  Controller function
//**************************************************************************
//***** mongodb get all of the Routes in Routes collection w
//      and Render information iwith an ejs view
router.get('/getAllOrders', controllerMongoCollection.getAllORDERS);

router.post('/storeData', controllerMongoCollection.storeData);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/doit', function(req, res, next) {
    res.render('doit', { title: 'Doit' });
});

module.exports = router;

var bodyParser = require('body-parser');
var path = require ('path'); //to work with separtors on any OS including Windows
var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode
//#########################################

//now processing post
router.post('/readNameAndRespond', function(req, res, next) {
    //expecting data variable called name --retrieve value using body-parser
    var value_name = req.body.name;  //retrieve the data associated with name
    res.send("hello " + value_name);
});


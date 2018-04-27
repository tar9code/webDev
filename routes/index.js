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

// redirect post request from /storeData to the database.js file in the controllers folder
router.post('/storeData', controllerMongoCollection.storeData);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/doit', function(req, res, next) {
    res.render('doit', { title: 'Doit' });
});

var mongodb = require('mongodb');
//var mongoDBURI = process.env.MONGODB_URI || ;

app.get('/mongodb', function (request, response) {

    mongodb.MongoClient.connect('mongodb://tarHaliax2:database925webDev@ds153015.mlab.com:53015/heroku_1n3hp41c', function(err, db) {
        if(err) throw err;
        //get collection of routes
        var NamesDB = db.collection('Names');
        //get all Routes with frequency >=1
        NamesDB.find().toArray(function (err, docs) {
            if(err) throw err;

            response.render('getAllOrders', {results: docs});

        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });
    });//end of connect
});//end app.get

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


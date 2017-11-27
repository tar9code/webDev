var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://tarHaliax2:database925webDev@ds153015.mlab.com:53015/heroku_1n3hp41c';

/** getAllRoutes controller logic that current does model logic too -connects to Mongo database and
 * queries the Routes collection to retrieve all the routes and build the output usig the
 * ejs template mongodb.ejs found in views directory
 * @param request
 * @param response
 *
 */
var bodyParser = require('body-parser');
var path = require ('path'); //to work with separtors on any OS including Windows
var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

//#########################################
module.exports.storeData =  function (req, res, next) {
    var shipment_info = req.body.userInfo;

    console.log( "got php data");
    console.log("first name: " + req.body.first.toString());
    console.log("check: " + req.body.gotIt);
    res.send("hello got php data.." + shipment_info);
    console.log( "the info: " + shipment_info);
    console.log( "last: " + shipment_info['last']);

    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;
        /**************************************************************************
         * IMPORTANT:  this is how you generate  a random number for  3IDs that
         * you will need for the collections cusomerID, billinID and   shippingID
         *    WHY?  the retrieve _id  info after and  insert (see below)  does not seem
         *     to function properly on Heroku
         *    so to know the ID we simply generate it in code  rather than
         *     autogenerate it for the documents we newly insert into the CUSOTMERS, BILLING, SHIPPING
         *      for ORDERS we allow the system to autogenerate its  _id
         */
        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);
        //customer collection operation
        var CUSTOMERS = db.collection('CUSTOMERS');
        /*CUSTOMERS.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var customerdata = {
            _id: customerID,
            /*FIRSTNAME: shipment_info['fname'],
            LASTNAME: shipment_info['lname'],
            STREET: shipment_info['add1'] + ' ' + shipment_info['add2'],
            CITY: shipment_info['city'],
            STATE: shipment_info['state'],
            ZIP: shipment_info['zipcode'],
            PHONE: shipment_info['phone']*/
        };/*
        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;
        })*/
    });
}

module.exports.getAllORDERS =  function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function(err, db) {
        if(err) throw err;

        //get collection of routes
        var Routes = db.collection('ORDERS');


        //FIRST showing you one way of making request for ALL routes and cycle through with a forEach loop on returned Cursor
        //   this request and loop  is to display content in the  console log
        var c = Routes.find({});

        c.forEach(
            function(myDoc) {
                console.log( "name: " + myDoc.name );  //just  loging the output to the console
            }
        );


        //SECOND -show another way to make request for ALL Routes  and simply collect the  documents as an
        //   array called docs that you  forward to the  getAllRoutes.ejs view for use there
        Routes.find().toArray(function (err, docs) {
            if(err) throw err;

            response.render('getAllOrders', {results: docs});

        });


        //Showing in comments here some alternative read (find) requests
        //this gets Routes where frequency>=10 and sorts by name
        // Routes.find({ "frequency": { "$gte": 10 } }).sort({ name: 1 }).toArray(function (err, docs) {
        // this sorts all the Routes by name
        //  Routes.find().sort({ name: 1 }).toArray(fu namenction (err, docs) {


        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });
    });//end of connect
};//end function
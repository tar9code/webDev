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
    // send response back to finalOrder.php saying that the data received
    res.send("Order Successful");
    console.log( "the info: " + shipment_info);
    //console.log("last: " + req.body.userInfo.last);

    // connect to mongoDB database
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
        var orderID = Math.floor((Math.random() * 1000000000000) + 1);
        //customer collection operation
        var CUSTOMERS = db.collection('CUSTOMERS');
        /*CUSTOMERS.deleteMany({}, function (err, result) {
        if (err) throw err;
        });*/
        var customerdata;
        // same billing and shipping address
        if (req.body.address2 == req.body.address)
        {
            customerdata = {
                _id: customerID,
                FIRSTNAME: req.body.first,
                LASTNAME: req.body.last,
                STREET: req.body.address,
                CITY: req.body.city,
                STATE: req.body.state,
                ZIP: req.body.zip,
                EMAIL: req.body.email
            };
        }
        // different billing and shipping addresses
        else {
            customerdata = {
                _id: customerID,
                FIRSTNAME: req.body.first,
                LASTNAME: req.body.last,
                STREET: req.body.address2,
                CITY: req.body.city2,
                STATE: req.body.state2,
                ZIP: req.body.zip2,
                EMAIL: req.body.email
            };
        }
        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;
        })

        // add billing data to database
        var BILLING = db.collection('BILLING');
        var billingdata = {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: req.body.pType,
            CREDITCARDNUM: req.body.pCard,
            CREDITCARDEXP: req.body.pMonth + "/" + req.body.pYear,
            CREDITCARDSECURITYNUM: req.body.pCode
        };
        BILLING.insertOne(billingdata, function (err, result) {
            if (err) throw err;
        })

        // add shipping data to database
        var SHIPPING = db.collection('SHIPPING');
        var shippingdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            SHIPPING_STREET: req.body.address,
            SHIPPING_CITY: req.body.city,
            SHIPPING_STATE: req.body.state,
            SHIPPING_ZIP: req.body.zip
        };
        SHIPPING.insertOne(shippingdata, function (err, result) {
            if (err) throw err;
        })

        // add the order to the database
        var ORDERS = db.collection('ORDERS')
        var orderdata = {
            _id: orderID,
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: new Date(),
            PRODUCT_VECTOR: req.body.products,
            ORDER_TOTAL: req.body.total
        };
        ORDERS.insertOne(orderdata, function (err, result) {
            if (err) throw err;
        })

    });
    mongodb.close();
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

module.exports.db =  function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function(err, db) {
        if(err) throw err;

        //get collection of routes
        var Routes = db.collection('Names');



        //SECOND -show another way to make request for ALL Routes  and simply collect the  documents as an
        //   array called docs that you  forward to the  getAllRoutes.ejs view for use there
        Routes.find().toArray(function (err, docs) {
            if(err) throw err;

            response.render('db', {results: docs});

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
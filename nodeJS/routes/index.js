var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/spitsgids';


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/survey', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    var trainnumber = req.query.trainnumber;

    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log("Unable to connect to the server");
        } else {
            var collection = db.collection('survey');

            if(trainnumber) {
                collection.find({"trainnumber": trainnumber}).toArray(function (err, result) {
                    processResult(err, result, res, function () {
                        db.close();
                    });
                });
            } else {
                collection.find({}).toArray(function (err, result) {
                    processResult(err, result, res, function () {
                        db.close();
                    });
                });
            }
        }
    });
});

var processResult = function(err, result, res, callback) {
    if (err) {
        res.send(err);
    } else if (result.length) {
        res.end(JSON.stringify(result));
    } else {
        res.send("Nothing found");
    }

    callback();
};

module.exports = router;
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
    var from = req.query.from;
    var to = req.query.to;

    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log("Unable to connect to the server");
        } else {
            var collection = db.collection('survey');

            if(trainnumber) {
                if(from && to) {
                    //.limit(1)!!!!!!!!!!!
                    collection.find({"trainnumber": trainnumber, "from": from}).toArray(function (errorFrom, resultFrom) {
                        collection.find({"trainnumber": trainnumber, "to": to}).toArray(function (errorTo, resultTo) {
                            var connectionFrom = getConnectionNumber(resultFrom);
                            var connectionEnd = getConnectionNumber(resultTo);

                            collection.find({"trainnumber": trainnumber, "connectionnumber": { $gte: connectionFrom, $lte: connectionEnd }}).toArray(function (err, result) {
                                processResult(err, result, res, function () {
                                    db.close();
                                });
                            });
                        });
                    });
                } else {
                    collection.find({"trainnumber": trainnumber}).toArray(function (err, result) {
                        processResult(err, result, res, function () {
                            db.close();
                        });
                    });
                }
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
        //console.log(result);
        res.end(JSON.stringify(result));
    } else {
        res.send("Nothing found");
    }

    callback();
};

var getConnectionNumber = function(result) {
    if (result.length) {
        console.log(result[0]["connectionnumber"]);
        return result[0]["connectionnumber"];
    } else {
        //Nothing
    }
};

module.exports = router;
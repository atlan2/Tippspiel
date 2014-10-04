/**
 * Created by Matthias on 10.08.14.
 */

var express = require('express');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser')

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tippspiel');

var app = express();
//http.createServer(app).listen(3000);
app.use(express.static('app'));
app.listen(3000);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); // to support URL-encoded bodies

app.use(function (req, res, next) {
    req.db = db;
    next();
});
//app.get('*', function(req, res) {
//    res.contentType('text/html');
//    res.status(200).send('Hallo Welt');
//});
function readFile(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        callback(JSON.parse(data));
    });
};

var partien;
var mannschaften;
readFile("data/partien.json", function (data) {
    partien = data
});
readFile("data/mannschaften.json", function (data) {
    mannschaften = data
});


app.get('/data/partien', function (req, res) {
    res.json(partien);

});

app.get('/data/mannschaften', function (req, res) {
    res.json(mannschaften);
});

app.post('/login', function (req, res) {
    console.log(req);
    res.send({id: 1337, user: {id: 2, name: 'matthias', role: 'admin'}});
});

app.post('/logout', function (req, res) {
    console.log(req);
    res.send(201, "");
});

var data = {
    "posts": [
        {
            "title": "Lorem ipsum",
            "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            "title": "Sed egestas",
            "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
        }
    ]
};

// GET

posts = function (req, res) {
    var posts = [];
    data.posts.forEach(function (post, i) {
        posts.push({
            id: i,
            title: post.title,
            text: post.text.substr(0, 50) + '...'
        });
    });
    res.json({
        posts: posts
    });
};

app.get('/posts', function (req, res) {
    posts(req, res);
});


app.get('/dbtest', function (req, res) {
    var db = req.db;
    var collection = db.get('tippCollection');
    collection.find({}, {}, function (e, docs) {
        res.json({
            posts: docs
        });

    });
});

app.post('/saveTipp', function (req, res) {
    var db = req.db;

    var partieId = req.body.partieId;
    var mannschaft1 = req.body.m1;
    var mannschaft2 = req.body.m2;
    var userId = req.body.userId;
    var collection = db.get('tippCollection');
    collection.update({"partieId": partieId, "userId": userId},
        {$set: {"m1": mannschaft1, "m2": mannschaft2}}, {upsert: true},
        function (err, doc) {
            console.log(err);
            console.log(doc);
        });

});

app.get('/getAllTipps', function (req, res) {
    var db = req.db;
    var sessionId = req.query.sessionId;
    var userId = GetUserIdForSessionId(sessionId)

    var collection = db.get('tippCollection');
    collection.find({"userId":userId}, {},
        function (err, docs) {
            res.json({
                posts: docs
            });
        });

});

var GetUserIdForSessionId = function(sessionId) {
    if(sessionId == 1337) {
        return 1;
    }
}


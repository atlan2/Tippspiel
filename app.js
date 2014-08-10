/**
 * Created by Matthias on 10.08.14.
 */

var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
//http.createServer(app).listen(3000);
app.use(express.static('app'));
app.listen(3000);


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

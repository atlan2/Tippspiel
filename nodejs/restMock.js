///**
// * Created by Matthias on 02.06.14.
// */
//var http = require("http");
//var server = http.createServer(function(request, response) {
//    console.log("empfangen");
//    response.writeHead(200, {"Content-Type":"text/plain"});
//    response.write("Cia");
//    response.end();
//});
//
//server.listen(8080);
var express = require('express');
var app = express();
app.get('/', function(req, res){
    res.send('hello world');
});
app.use('/api', express.static('../data/mannschaften.json'));
app.use('.*', express.static(__dirname + '/assets'));

app.listen(8080);
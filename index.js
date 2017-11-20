'use strict';
var http = require('http'),
    router = require('./router');
http.createServer(function (req, res) {
    // var url = parse(req.url);
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    // });
    router(req, res);
}).listen(80);
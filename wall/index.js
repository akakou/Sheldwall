/*
  wall/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/

var https = require('https');
var express = require('express');
var app = express();

var proxy_client = require('./proxy_client')
var config = require('./config')


/* create https server */
https.createServer(config.ssl, function (req,res) {
  /*
    get arguments and send
    response to client
  */
  proxy_client.getWeb.then(function(response){
    // https header
    res.writeHead(200, response.headers);

    // https body
    res.end(response.body);
  })
}).listen(config.port);

console.log('Server running at http://localhost:' + config.port);

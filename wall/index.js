/*
  wall/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/


var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();


/* main config */
var config = {
  // port
  port: process.env['PORT'],

  // ssl keys
  ssl: {
    pfx: fs.readFileSync(__dirname + process.env['SSL_PFX']),
    passphrase: process.env['SSL_PASS']
  }
};


/* create https server */
https.createServer(config.ssl, function (req,res) {
  // https head
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  // https body
  res.end("Hello, world\n");
}).listen(config.port);

console.log('Server running at https://localhost:' + config.port);

/*
  wall/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/

var httpProxy = require('http-proxy');
var fs = require('fs');


/* main config */
var config = {
  // port
  port: process.env['PORT'],

  // ssl keys
  ssl: {
    key: fs.readFileSync(__dirname + process.env['SSL_KEY'], 'utf8'),
    cert: fs.readFileSync(__dirname + process.env['SSL_CERT'], 'utf8'),
  }
};


var proxy = httpProxy.createServer({
    ssl: config.ssl,
    target: 'https://www.google.com',
    secure: true
}).listen(443);


proxy.on('proxyReq', function (proxyReq, req, res) {
  console.log(proxyReq);
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  console.log(proxyRes);
});



console.log('Server running at https://localhost:' + config.port);

/*
  wall/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/

var fs = require('fs');
var hoxy = require('hoxy');


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


/* run proxy server  */
var proxy = hoxy.createServer({
    certAuthority: config.ssl,
}).listen(config.port);


/* call when proxy get request */
proxy.intercept({
    phase: 'request'
}, function(req, resp, cycle) {
    console.log(req.url);
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

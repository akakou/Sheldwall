/*
  wall/config.js

  It set server's main configs
  (port, ssl_keys, passphrase) !
*/

var fs = require('fs');


var config = {
  // port
  port: process.env['PORT'],

  // ssl keys
  ssl: {
    pfx: fs.readFileSync(__dirname + process.env['SSL_PFX']),
    passphrase: process.env['SSL_PASS']
  }
};


module.exports = config;

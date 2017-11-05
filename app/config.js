/*
  app/index.js

  It is config source of sheldwall.
*/

var fs = require('fs');


var config = {
  // port
  port: process.env['PORT'],

  // ssl keys
  ssl: {
    key: fs.readFileSync(__dirname + process.env['SSL_KEY'], 'utf8'),
    cert: fs.readFileSync(__dirname + process.env['SSL_CERT'], 'utf8'),
  }
};

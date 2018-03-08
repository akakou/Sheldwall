/*
  app/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/
'use strict'

var hoxy = require('hoxy');
var mongo = require("mongodb").MongoClient;

var https = require('https');
var auth = require('basic-auth');
var express = require("express");
var app = express();

var controll = require('./controll');
var config = require('./config');
var filter = require('./filter');
var update = require('./update');
var analytics = require('./analytics');
var init = require('./init')

var sha256 = require("sha256");


process.on('unhandledRejection', console.dir);

init();

/* run proxy server */
var proxy = {
  ssl: hoxy.createServer({
    certAuthority: config.ssl,
  }).listen(config.port.ssl),

  plain: hoxy.createServer().listen(config.port.plain),
  
  web: https.createServer(config.ssl, app)
        .listen(config.port.web)
}

/* call when proxy get request */
proxy.ssl.intercept({
  phase: 'response',
  as: 'string'
}, controll.string);

proxy.plain.intercept({
  phase: 'response',
  as: 'string'
}, controll.string);

/* create analytics site server */
// express setting
app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  // get analytics data
  var template_data = await analytics();

  // basic auth
  var credential = auth(req);
  if (!credential || credential.name !== config.auth.name || sha256(credential.pass) !== config.auth.password) {
    // access denied
    res.writeHead(401, {'WWW-Authenticate':'Basic realm="secret zone"'});
    res.end('Access denied');
  } else {
    // render data and show
    res.render('analytics', template_data);
  }
});


/* show */
console.log('SSL Proxy server running at https://localhost:' + config.port.ssl);
console.log('HTTP Proxy server running at https://localhost:' + config.port.plain);
console.log('Web server running at https://localhost:' + config.port.web);

/* updating signature loop */
update();

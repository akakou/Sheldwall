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

var config = require('./config');
var filter = require('./filter');
var update = require('./update');
var analytics = require('./analytics');

var sha256 = require("sha256");


process.on('unhandledRejection', console.dir);

/* run proxy server */
var proxy = hoxy.createServer({
  certAuthority: config.ssl,
}).listen(config.port.proxy);

/* call when proxy get request */
proxy.intercept({
  phase: 'response',
  as: 'string'
}, async (req, resp, cycle) => {
  console.log('access from ' + req.hostname);
  var res = resp.string;

  /* database transaction */
  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async (err, client) => {
      // saved log
      var log = {
        response: resp,
        request: req,
        time: new Date().getTime(),
        is_block: false
      };

      // check error
      if(err){
        console.log(err);
        return;
      }

      // check response that is secure
      var is_secure = await filter.string(res, client);

      if (!is_secure){
        resp.string = config.danger_message;
      }

      log.is_block = is_secure;

      // connect to collenction
      var db = client.db("test");

      // insert response
      await db.collection('log').insertOne(log, (error, result) => {
        // check error
        if(err){
          console.log(err);
          return;
        }
      });

      // after treatment
      client.close();
      resolve();
    });
  });

  return;
});


/* create analytics site server */
var server = https.createServer(config.ssl, app).listen(config.port.web);

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
console.log('Proxy server running at https://localhost:' + config.port.proxy);
console.log('Web server running at https://localhost:' + config.port.web);

/* updating signature loop */
update();

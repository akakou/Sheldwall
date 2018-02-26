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
}).listen(config.port);

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

      var log = {
        response: resp,
        request: req,
        time: new Date(),
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


var server = https.createServer(config.ssl, app);

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');


app.get("/", async (req, res) => {
  var template_data = await analytics.access();
  var credential = auth(req);

  if (!credential || credential.name !== config.auth.name || sha256(credential.pass) !== config.auth.password) {
    res.writeHead(401, {'WWW-Authenticate':'Basic realm="secret zone"'});
    res.end('Access denied');
  } else {
    //res.end('Access permitted');
    console.log(template_data);
    res.render('analytics', template_data);
  }
});

server.listen(8080);

/* console log */
console.log('Server running at https://localhost:' + config.port);

/* updating signature loop */
update();

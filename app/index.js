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
      // check error
      if(err){
        console.log(err);
        return;
      }

      // connect to collenction
      var db = client.db("test");

      // insert response
      await db.collection('log').insertOne(req, (error, result) => {
        // check error
        if(err){
          console.log(err);
          return;
        }
      });

      // check response that is secure
      resp.string = await filter.string(res, client);

      // after treatment
      client.close();
      resolve();
    });
  });

  return;
});


var name = 'username';
var password = 'pass';


var server = https.createServer(config.ssl, app);

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
  var credential = auth(req);
  var count = 0;
  var ary = {
    ary: {
      'access': ['1', '2', '3'],
      'block': [],
      'destination': [],
      'source': []
    }
  };

  if (!credential || credential.name !== config.auth.name || sha256(credential.pass) !== config.auth.password) {
    res.writeHead(401, {'WWW-Authenticate':'Basic realm="secret zone"'});
    res.end('Access denied');
  } else {
    res.render('analytics', ary);
  }
});

server.listen(8080);

/* console log */
console.log('Server running at https://localhost:' + config.port);

/* updating signature loop */
update();

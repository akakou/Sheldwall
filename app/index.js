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



var server = https.createServer(config.ssl, app);

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  var credential = auth(req);
  var count = 0;

  var access_list = [];

  var ary = {
    access: [],
    block: [],
    destination: [],
    source: []
  };

  var unsorted_ary = {
    access: [],
    block: [],
    destination: [],
    source: []
  };

  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async (err, client) => {
      var db = client.db('test');

      /* get all signature from database */
      await new Promise((resolve) => {
        db.collection('log').find().toArray((err, items) => {
          access_list = items;
          var access_list_tmp = [];
          
          for (var items of access_list){
            access_list_tmp.push(items._data.hostname);
          }

          unsorted_ary.access = access_list_tmp;

          resolve();
        });
      });

      // sort and remove duplication
      for (var access of unsorted_ary.access){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.access.indexOf(access);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.access.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.access.push({host:access, count:hit_count});
      }

      resolve();
    });
  });

  console.log(ary);


  /*
  if (!credential || credential.name !== config.auth.name || sha256(credential.pass) !== config.auth.password) {
    res.writeHead(401, {'WWW-Authenticate':'Basic realm="secret zone"'});
    res.end('Access denied');
  } else {
    res.render('analytics', ary);
  }

  */

});

server.listen(8080);

/* console log */
console.log('Server running at https://localhost:' + config.port);

/* updating signature loop */
update();

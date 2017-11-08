/*
  app/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/
'use strict'

var hoxy = require('hoxy');
var mongo = require("mongodb").MongoClient;

var config = require('./config')
var filter = require('./filter')
var update = require('./update')


/* updating signature loop */
update();


/* run proxy server  */
var proxy = hoxy.createServer({
  certAuthority: config.ssl,
}).listen(config.port);


/* call when proxy get request */
proxy.intercept({
  phase: 'response',
  as: 'string'
}, function(req, resp, cycle) {
  console.log('access from' + req.hostname);

  /* add response log to mongodb */
  mongo.connect(config.mongo.url, async (err, db) => {
    // check error
    if(err){
      console.log(err);
      return;
    }

    // connect to collenction
    var collection = db.collection("log");

    // insert response
    collection.insertOne(req, (error, result) => {
      // check error
      if(err){
        console.log(err);
	      return;
      }
    });

    // close database
    db.close();
  });
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

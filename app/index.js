/*
  app/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/
'use strict'

var hoxy = require('hoxy');
var config = require('./config')
var filter = require('./filter')
var update = require('./update')
var mongo = require("mongodb").MongoClient;


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
  console.log('hello');

  /* add response log to mongodb */
  mongo.connect(config.mongo.url, function(error, db){
    // check error
    if(error){
      console.log(error);
      return;
    }

    // connect to collenction
    var collection = db.collection("log");

    // insert response
    collection.insertOne(req, function(error, result){
      // check error
      if(error){
        console.log(error);
	return;
      }
      // close database
      db.close();
    });
  });
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

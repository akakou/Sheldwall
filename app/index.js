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


/* connect to mongodb */
mongo.connect(config.mongo.url, function(error, db){
  // check error
  if(error){
    console.log(error);
  }

  // open log collection
  var collection = db.collection("log");
  
  // close database
  db.close();
});


/* updating signature loop */
update();


/* run proxy server  */
var proxy = hoxy.createServer({
  certAuthority: config.ssl,
}).listen(config.port);


/* call when proxy get request */
proxy.intercept({
  phase: 'response',
  as: 'json'
}, function(req, resp, cycle) {
  console.log('hello');

  mongo.connect(config.mongo_url, function(error, db){
    if(error){
      console.log(error);
    }

    var collection = db.collection("log");

    collection.insertOne(req.json, function(error, result){
      db.close();
    });
  });
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

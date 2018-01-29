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


/* console log */
console.log('Server running at https://localhost:' + config.port);

/* updating signature loop */
update();

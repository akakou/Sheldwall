'use strict'

var mongo = require('mongodb').MongoClient;

var config = require('./config');
var filter = require('./filter');

process.on('unhandledRejection', console.dir);


async function controll_string(req, resp, cycle) {
  console.log('access to ' + req.hostname);
  var res = resp.string;

  /* database transaction */
  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async(err, client) => {
      // saved log
      var log = {
        response: resp,
        request: req,
        time: new Date().getTime(),
        is_secure: false
      };

      // check error
      if(err){
        console.log(err);
        resolve();
      }

      // check response that is secure
      log.is_secure = await filter.string(res, client, log);

      if (!log.is_secure){
        resp.string = config.danger_message;
        console.log('blocked !');
      }

      // connect to collenction
      var db = client.db("test");

      // insert response
      await db.collection('log').insertOne(log, (error, result) => {
        // check error
        if(err){
          console.log(err);
          resolve();
        }
      });

      // after treatment
      client.close();
      resolve();
    });
  });
}

module.exports = {
  string: controll_string
}

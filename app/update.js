/*
  app/update.js

  It is source updating signature list.
*/
'use strict'

var fs = require('fs');
var mongo = require("mongodb").MongoClient;

var config = require('./config');


/* update signature */
function update() {
  /* pull or clone signature data */
  (() => {
    /* check folder exist */
    var isExistFile = function(file){
      try {
        fs.accessSync('./signature');
        return true;
      } catch(err) {
        if(err.code === 'ENOENT'){
          return false;
        }
      }
    }

    // check folder exist
    if (isExistFile(config.git.directory)) {
      console.log('signature pull !');
      require('simple-git')(config.git.directory).pull();
    } else {
      console.log('signature clone !');
      require('simple-git')().clone(config.git.url, config.git.directory);
    }
  })();


  /* take in sigature from git repository */
  (() => {
    // get file list
    var file_list = [];
    var temporary_file_list = fs.readdirSync('./signature');

    // remove not json data
    for(var file of temporary_file_list){
      if(file.slice(-5) == '.json'){
        file_list.push(file);
      }
    }

    /* add signature log to mongodb */
    mongo.connect(config.mongo.url, async (err, client) => {
      // check error
      if(err){
        console.log(err);
        return;
      }

      // connect to collenction
      var db = client.db('test');

      /* insert signature data to mongodb */
      for(var file of file_list){
        // read file and dump to json
        var file = fs.readFileSync('./signature/' + file, 'utf-8');
        var signature = JSON.parse(file);

        // insert response
        await db.collenction('signature').insertOne(signature, () => {
          // check error
          if(err){
            console.log(err);
            return;
          } else{
            console.log('insert signature !');
          }
        });
      }

      // close database connection
      client.close();
    });
  })();


  /* settimeout loop */
  setTimeout(update, 10*60*1000);
}


module.exports = update;

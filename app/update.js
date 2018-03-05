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

      // connect to collection
      var db = client.db('test');

      // remove signature
      await db.collection('signature').deleteMany({})

      /* insert signature data to mongodb */
      for(var file of file_list){
        // read file and dump to json
        var file = fs.readFileSync('./signature/' + file, 'utf-8');
        var signature = JSON.parse(file);
        
        // insert signature
        await db.collection('signature').insertMany(signature, () => {
          // check error
          if(err){
            console.log(err);
            return;
          } else {
            console.log('insert signature !');
          }
        });

        // optimization db
        await db.collection('signature').ensureIndex({type: 1, value: 1}, {unique: true, dropDups: true});
      }

      // close database connection
      client.close();
    });
  })();


  /* settimeout loop */
  setTimeout(update, 10*60*1000);
}


module.exports = update;

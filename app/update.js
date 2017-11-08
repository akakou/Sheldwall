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
  function updateGitRepo(){
    /* check folder exist */
    function isExistFile(file) {
      try {
        fs.accessSync('./signature');
        return true;
      } catch(err) {
        if(err.code === 'ENOENT') return false
      }
    }

    // check folder exist
    if (isExistFile(config.git.directory)) {
      console.log('pull');
      require('simple-git')(config.git.directory).pull();
    } else {
      console.log('clone');
      require('simple-git')().clone(config.git.url, config.git.directory);
    }
  }

  /* take in sigature from git repository */
  function takeInFromGitRepo(){
    console.log('hoge')
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
    mongo.connect(config.mongo.url, function(err, db) {
      // check error
      if(err){
        console.log(err);
        return;
      }

      // connect to collenction
      var collection = db.collection('signature');

      /* insert signature data to mongodb */
      async function insert(){
        for(var file of file_list){
          // read file and dump to json
          var file = fs.readFileSync('./signature/' + file, 'utf-8');
          var signature = JSON.parse(file);

          // insert response
          collection.insertOne(signature, function(error, result){
            // check error
            if(err){
              console.log(err);
              return;
            }
          });
        }
      }
      /* close db connection */
      async function close(){
        // close database
        db.close();
      }

      /* do with promise */
      insert().then(close());
    });
  }

  /* main script for update signature*/
  var updateSignature = function(){
    updateGitRepo();
    takeInFromGitRepo();
  };

  updateSignature();

  setInterval(updateSignature, 10*60*1000);
}



module.exports = update;

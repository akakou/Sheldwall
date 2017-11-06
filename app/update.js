/*
  app/update.js

  It is source updating signature list.
*/
'use strict'

var fs = require('fs');

var config = require('./config');


/* check folder exist */
function isExistFile(file) {
  try {
    fs.accessSync('./signature');
    return true
  } catch(err) {
    if(err.code === 'ENOENT') return false
  }
}


/* update signature */
function update() {
  function control_git(){
    // check folder exist
    if (isExistFile(config.git.directory)) {
      console.log('pull');
      require('simple-git')(config.git.directory).pull();
    } else {
      console.log('clone');
      require('simple-git')().clone(config.git.url, config.git.directory);

    }
  }
  control_git();

  setInterval(control_git, 10*60*1000);
}


module.exports = update;

/*
  app/filter.js

  It is source check response and signature list
  to be filter from danger site.
*/
'use strict'

var crypto = require('crypto')

var config = require('./config');


/* filter site with response text */
async function checkString(response, client, log){
  // check response danger
  var signature_list = [];
  var db = client.db('test');
  var is_secure = true;

  /* get all signature from database */
  await new Promise((resolve) => {
    db.collection('signature').find().toArray((err, items) => {
      signature_list = items;
      resolve();
  })});

  // compare signature and response
  for(var signature of signature_list){
    if (signature.type === 'include'){
      is_secure = (response.indexOf(signature.value) === -1);

    } else if(signature.type === 'hash'){
      var md5 = crypto.createHash('md5');
      var hash = md5.update(response, 'binary').digest('hex');

      is_secure = (hash !== signature.value);

    } else if(signature.type === 'hostname'){
      is_secure = (log.request._data.hostname !== signature.value);
    }

    if(!is_secure){
      return false;
    }
  }
  return true;
}


module.exports = {
  // message used denger_message
  string: checkString
};

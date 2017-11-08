/*
  app/filter.js

  It is source check response and signature list
  to be filter from danger site.
*/
'use strict'

var mongo = require("mongodb").MongoClient;

var config = require('./config');


/* filter site with response text */
async function checkString(response, db){
  // check response danger
  var signature_list = [];
  var collection = db.collection("signature");
  var is_secure = true;

  /* get all signature from database */
  await new Promise((resolve) => {
    collection.find().toArray((err, items) => {
      signature_list = items;
      resolve();
  })});

  // compare signature and response
  for(var signature of signature_list){
    var is_secure = (response.indexOf(signature.string) === -1);

    if(!is_secure){
      return config.danger_message;
    }
  }
  return response;
}


module.exports = {
  // message used denger_message
  string: checkString
};

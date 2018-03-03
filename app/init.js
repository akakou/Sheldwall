var mongo = require('mongodb').MongoClient;
var config = require('./config');

module.exports = function(){
  mongo.connect(config.mongo.url, async (err, client) => {
    // connect to collenction
    var db = client.db('test');
    
    db.createCollection('log', function(err, res) {
      
    });
    db.createCollection('signature', function(err, res) {
    
    });

  client.close();

  });
}

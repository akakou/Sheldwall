var mongo = require("mongodb").MongoClient;

var config = require('./config');


async function analytics_access_site(){
  var count = 0;

  var access_list = [];

  var ary = {
    access: [],
    block: [],
    destination: [],
    source: []
  };

  var unsorted_ary = {
    access: [],
    block: [],
    destination: [],
    source: []
  };

  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async (err, client) => {
      var db = client.db('test');

      /* get all signature from database */
      await new Promise((resolve) => {
        db.collection('log').find().toArray((err, items) => {
          access_list = items;
          var access_list_tmp = [];
          
          for (var items of access_list){
            access_list_tmp.push(items._data.hostname);
          }

          unsorted_ary.access = access_list_tmp;

          resolve();
        });
      });

      // sort and remove duplication
      for (var access of unsorted_ary.access){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.access.indexOf(access);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.access.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.access.push({host:access, count:hit_count});
      }

      resolve();
    });
  });

  console.log(ary);
  return ary;

}

module.exports = {
  // message used denger_message
  access: analytics_access_site
};

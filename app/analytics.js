var mongo = require("mongodb").MongoClient;

var config = require('./config');


async function analytics_time_site(){
  var count = 0;

  var time_list = [];

  var ary = {
    time: [],
    destination: [],
    block_time: [],
    block_destination: []
    //source: []
  };

  var unsorted_ary = {
    time: [],
    destination: [],
    block_time: [],
    block_destination: []
    //source: []
  };

  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async (err, client) => {
      var db = client.db('test');

      /* get all signature from database */
      await new Promise((resolve) => {
        db.collection('log').find().toArray((err, items) => {

          for (var item of items){
            item.time.setMilliseconds(0);
            item.time.setSeconds(0);
            item.time.setMinutes(0);
            item.time.setHours(0);

            unsorted_ary.time.push(item.time.toString());
            //unsorted_ary.source.push(item.request._data.hostname);
            unsorted_ary.destination.push(item.request._data.hostname);

            if (!item.is_secure){
              unsorted_ary.block_destination.push(item.request._data.hostname);
              unsorted_ary.block_time.push(item.time.toString());
            }
          }

          resolve();
        });
      });

      // sort and remove duplication
      for (var time of unsorted_ary.time){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.time.indexOf(time);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.time.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.time.push({time:time, count:hit_count});
      }


      for (var hostname of unsorted_ary.block_destination){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.block_destination.indexOf(hostname);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.block_destination.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.block_destination.push({hostname:hostname, count:hit_count});
      }

      for (var time of unsorted_ary.block_time){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.block_time.indexOf(time);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.block_time.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.block_time.push({time:time, count:hit_count});
      }


      for (var destination of unsorted_ary.destination){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.destination.indexOf(destination);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.destination.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.destination.push({destination:destination, count:hit_count});
      }

      /*
      for (var source of unsorted_ary.source){
        var hit_count = 0;
        var hit_index = 0;

        while(true){
          hit_index = unsorted_ary.block.indexOf(source);
          
          if (hit_index != -1){
            hit_count ++;
            unsorted_ary.source.splice(hit_index, 1);

          }else{
            break;
          }
        }
        
        ary.source.push({source:source, count:hit_count});
      }
      */

      resolve();
    });
  });

  console.log(ary);
  return ary;

}


module.exports = {
  // message used denger_message
  access: analytics_time_site
};

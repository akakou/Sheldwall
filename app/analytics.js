var mongo = require("mongodb").MongoClient;

var config = require('./config');


const A_DAY = 86400000;
const THIRTY_DAYS = A_DAY * 30;



/* analytics data */
async function analytics(){
  /* sort access time and block time */
  function sort(data_list){
    var result = [];

    for (var data of data_list){
      // initialize count and index
      var hit_count = 0;
      var hit_index = 0;

      while(true){
        // check hit
        hit_index = data_list.indexOf(data);

        if (hit_index != -1){
          // if hit, increment hit_count and delete it from list
          hit_count ++;
          data_list.splice(hit_index, 1);

        }else{
          break;
        }
      }
      // push dict
      result.push({key:data, count:hit_count});
    }

    return result;
  }


  var now = new Date();
  var THIRTY_DAYS_AGO = now.getTime() - THIRTY_DAYS;

  var logs = await new Promise((resolve) => {
    mongo.connect(config.mongo.url, (err, client) => {
      var db = client.db('test');

      /* get all signature from database */
      var logs = {
        access_time: [],      // the time accessed
        destination: [],      // the destination
        block_time: [],       // the time blocked
        block_destination: [] // the destination blocked
      };

      db.collection('log').find({time: { $gt: THIRTY_DAYS_AGO }}).toArray((err, items) => {

        for (var item of items){
          // clear yy:mm:dd:XXXX
          item.time = new Date(item.time);
          item.time.setMilliseconds(0);
          item.time.setSeconds(0);
          item.time.setMinutes(0);
          item.time.setHours(0);

          // push access logs
          logs.access_time.push(item.time.toString());
          logs.destination.push(item.request._data.hostname);

          if (!item.is_secure){
            // push destination logs
            logs.block_destination.push(item.request._data.hostname);
            logs.block_time.push(item.time.toString());
          }
        }

        resolve(logs);
      });
    })
  });

  logs.access_time = sort(logs.access_time);
  logs.destination = sort(logs.destination);
  logs.block_time = sort(logs.block_time);
  logs.block_destination = sort(logs.block_destination);

  return logs;
}

module.exports = analytics;

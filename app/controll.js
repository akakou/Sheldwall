async function ssl_proxy(req, resp, cycle) {
  console.log('access from ' + req.hostname);
  var res = resp.string;

  /* database transaction */
  await new Promise((resolve) => {
    mongo.connect(config.mongo.url, async (err, client) => {
      // saved log
      var log = {
        response: resp,
        request: req,
        time: new Date().getTime(),
        is_secure: false
      };

      // check error
      if(err){
        console.log(err);
        return;
      }

      // check response that is secure
      log.is_secure = await filter.string(res, client, log);

      if (!log.is_secure){
        resp.string = config.danger_message;
      }

      // connect to collenction
      var db = client.db("test");

      // insert response
      await db.collection('log').insertOne(log, (error, result) => {
        // check error
        if(err){
          console.log(err);
          return;
        }
      });

      // after treatment
      client.close();
      resolve();
    });
  });

  return;
}

module.exports = {
  string: ssl_proxy
}

/*
  wall/proxy_client.js

  It send http request to other server
  and get response
*/

var request = require('request');


var proxy_client = {
  /* send request as client  */
  getWeb: new Promise(function(resolve){
    var request_data = {
      url: 'https://example.com',
      method: 'GET',
      headers: {
        'Content-Type':'text/html; charset=utf-8'
      }
    };

    // send request
    request(request_data, function (error, response, body) {
      resolve(response);
    });
  })
};

module.exports = proxy_client;

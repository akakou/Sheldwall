/*
  wall/proxy_client.js

  It send http request to other server
  and get response
*/

var request = require('request');
var Iconv = require('iconv').Iconv;
var jschardet = require('jschardet')

var proxy_client = {
  /* send request as client  */
  getWeb: function(proxy_client_request){
    return new Promise(function(resolve){
      // reset request data
      var header_json = proxy_client_request.headers;
      /*
      proxy_client_request = {
        url: proxy_client_request.url,
        method: proxy_client_request.method,
        headers: proxy_client_request.headers
      };
      */

      proxy_client_request = {
        url: 'http://www.google.co.jp',
        method: 'GET',
        headers: {
          'Host':'www.google.co.jp',
        },
        encoding: null
      };

      // send request
      request(proxy_client_request, function (error, response, body) {
        // encode to utf-8
        var response_encode = jschardet.detect(body).encoding;
        var iconv = new Iconv(response_encode, 'UTF-8//TRANSLIT//IGNORE');
        response.body = iconv.convert(body).toString();

        resolve(response);
      });
    });
  }
};

module.exports = proxy_client;

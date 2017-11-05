/*
  app/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/

var hoxy = require('hoxy');
var config = require('./config.js')
var filter = require('./filter.js')


/* run proxy server  */
var proxy = hoxy.createServer({
  certAuthority: config.ssl,
}).listen(config.port);


/* call when proxy get request */
proxy.intercept({
  phase: 'response',
  as: 'string'
}, function(req, resp, cycle) {
  console.log('hello');
  resp.string = filter.string(resp.string);
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

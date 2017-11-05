/*
  app/index.js

  It is main source of sheldwall.
  In now, it it program for https proxy.
*/

var hoxy = require('hoxy');


/* run proxy server  */
var proxy = hoxy.createServer({
  certAuthority: config.ssl,
}).listen(config.port);


/* call when proxy get request */
proxy.intercept({
  phase: 'response',
  as: 'string'
}, function(req, resp, cycle) {
  resp.string += 'hogehogehogehoge';
});


/* console log */
console.log('Server running at https://localhost:' + config.port);

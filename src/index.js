var http = require('http');

var port = process.env['PORT']
    .slice(1)
    .slice(0, -1);

port = parseInt(port)


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port);


console.log('Server running at http://localhost:' + port);

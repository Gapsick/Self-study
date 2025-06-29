const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'test/plain'
    });
    res.end('Hello, world');
})

server.listen(4000);
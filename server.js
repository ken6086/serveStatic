// serveStatic
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

// ssl
const httpsOption = {
    key: fs.readFileSync("./xxxxx.key"),
    cert: fs.readFileSync("./xxxxx.pem")
}

// server port
const port = 80;
const sslPort = 443;

// Serve up public
const serve = serveStatic(path.join(__dirname, 'public'), {
    'index': ['index.html', 'index.htm'],
    maxAge: '1d',
    setHeader: setCustomCacheControl
})

// Create server
const server = http.createServer(function onRequest(req, res) {
    // redirect https
    res.writeHead(301, {'Location': 'https://xxxxx.xxx/'});
    res.end();
    // with middleware-style functions
    serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(port, () => console.log(`OK listening at http://localhost:${port}`));

https.createServer(httpsOption, function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
}).listen(sslPort);

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
    }
}

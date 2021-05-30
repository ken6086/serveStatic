# serveStatic
http-https

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');
const formidable = require('formidable');

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

    // parse a file upload
    if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
        const form = formidable();
        //设置编码格式
        form.encoding = 'utf-8';
        form.multiples = true;
        //保留后缀
        form.keepExtensions = true;
        //设置保存路径
        form.uploadDir = path.join(__dirname, '/tmp/');
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end(String(err));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(JSON.stringify({fields, files}, null, 2));
        });
        return;
    }
    // redirect https
    res.writeHead(301, {'Location': 'https://xxxxx.xxx/'});
    res.end();
    // with middleware-style functions
    serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(port, () => console.log(`OK listening at http://localhost:${port}`));

https.createServer(httpsOption, function onRequest(req, res) {

    // parse a file upload
    if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
        const form = formidable();
        //设置编码格式
        form.encoding = 'utf-8';
        form.multiples = true;
        //保留后缀
        form.keepExtensions = true;
        //设置保存路径
        form.uploadDir = path.join(__dirname, '/tmp/');
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end(String(err));
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            res.end(JSON.stringify({fields, files}, null, 2));
        });
        return;
    }

    serve(req, res, finalhandler(req, res));
}).listen(sslPort);


function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
    }
}


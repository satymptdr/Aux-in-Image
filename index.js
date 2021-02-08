const express = require("express");
const http = require('http');
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = 3000;

const home = fs.readFileSync('./index.html');
const singup = fs.readFileSync('./singup.html');
const feed = fs.readFileSync('./feed.html');
// app.use(express.static('./Xmeme/frontend' + '/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join('C:\Learnings\Xmeme\frontend', '/')));

const server = http.createServer((req, res) => {
    console.log(req.url);
    url = req.url;

    res.statuCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (url == '/') {
        res.end(home);
    }
    else if (url == '/singup') {
        res.end(singup);
    }
    else if (url == '/feed') {
        res.end(feed);
    }
    else {
        res.statusCode = 404;
        res.end("<h1>404 not found</h1>");
    }

});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
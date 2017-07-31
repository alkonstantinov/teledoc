'use strict';
const express = require('express')
const fileSystem = require('fs');
const session = require('express-session');
const Pool = require('pg').Pool;

var http = require('http');
var port = process.env.PORT || 1337;

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

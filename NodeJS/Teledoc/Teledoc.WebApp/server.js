'use strict';
const express = require('express')
const fileSystem = require('fs');
const session = require('express-session');
const url = require('url');
const pool = require('pg').Pool;
const path = require('path');
const translate = require('./js/translate/translate');
const dl = require('./js/dl/dl');

const app = express();
const pgConfig = {
    host: '127.0.0.1',
    user: 'postgres',
    password: '123',
    database: 'zp',
};
var Pool = new pool(pgConfig);



var port = process.env.PORT || 1337;

app.use(express.static(path.join(__dirname, '/')));

app.get('/kor', function (req, res) {
    res.send('Hello KOR!')
    res.end();
});

app.get('/pg', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    dl.Test(Pool, function (jsonResult)
    {
        res.send(JSON.stringify(jsonResult));
        res.end();
    });
        

});

app.get('*', function (req, res) {
    //res.send("-1");
    res.send(translate.Translate('bg', 'login', fileSystem));
    res.end();
});




//var fs = require('fs');

app.listen(port, function () {
    console.log('Example app listening on port 3000!')
})

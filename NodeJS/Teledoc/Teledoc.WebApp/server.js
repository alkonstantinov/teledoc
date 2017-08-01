'use strict';
const express = require('express')
const fileSystem = require('fs');
const session = require('express-session');
const url = require('url');
const pool = require('pg').Pool;
const path = require('path');
const bodyParser = require("body-parser");
const md5 = require("md5");


const translate = require('./js/translate/translate');
const dl = require('./js/dl/dl');

const app = express();
const pgConfig = {
    host: '127.0.0.1',
    user: 'postgres',
    password: '123',
    database: 'Teledoc',
};
var Pool = new pool(pgConfig);



var port = process.env.PORT || 1337;

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'VerySpecific', resave: true, saveUninitialized: true }));


//-------------------------------functions
function GetLocale(req) {
    var sess = req.session;
    if (sess.locale == undefined)
        sess.locale = "bg";
    return sess.locale;

}

function GetLevelId(req) {
    var sess = req.session;
    if (sess.levelid == undefined)
        sess.levelid = -1;
    return sess.levelid;

}

function TranslateString(locale, input) {
    var match = input.match(/#([^#]+)#/);
    while (match != null) {
        input = input.replace(match[0], translate.Translate(locale, match[1], fileSystem));
        match = input.match(/#([a-zA-Z]+)#/);
    }
    return input;
}

//-------------------------------requests

app.get('/kor', function (req, res) {
    res.send('Hello KOR!')
    res.end();
});

app.get('/pg', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    dl.Test(Pool, function (jsonResult) {
        res.send(JSON.stringify(jsonResult));
        res.end();
    });


});

app.get('/getlocale', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(GetLocale(req));
    res.end();
});

app.post('/changelocale', function (req, res) {

    req.session.locale = req.body.locale;

    res.end();
});

app.get('/getinitialpage', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    var levelId = GetLevelId(req);
    var locale = GetLocale(req);
    switch (levelId) {
        case -1:
            var content = fileSystem.readFileSync("pages/login.html", "utf8");
            content = TranslateString(locale, content);
            res.send(content);
            res.end();
            break;
        case 4:
            var content = fileSystem.readFileSync("pages/issuetarget.html", "utf8");
            content = TranslateString(locale, content);
            res.send(content);
            res.end();
            break;
    }


});

app.post('/login', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    dl.Login(Pool, req.body.Username, md5(req.body.Password), function (jsonResult) {
        req.session.levelid = (jsonResult == null ? -1 : jsonResult.levelid);
        res.send({ LevelId: (jsonResult == null ? -1 : jsonResult.levelid) });
        res.end();
    });

});


app.get('/getissuetargetpage', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    var locale = GetLocale(req);
    var content = fileSystem.readFileSync("pages/issuetarget.html", "utf8");
    content = TranslateString(locale, content);
    res.send(content);
    res.end();
});



//--------------------------------------------------------------
app.get('*', function (req, res) {
    //res.send("-1");
    res.send(translate.Translate('bg', 'login', fileSystem));
    res.end();
});

//var fs = require('fs');

app.listen(port, function () {
    console.log('Example app listening on port 3000!')
})

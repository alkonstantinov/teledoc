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

function SendPage(url, req, res) {
    res.setHeader('Content-Type', 'text/html');
    var locale = GetLocale(req);
    var content = fileSystem.readFileSync(url, "utf8");
    content = TranslateString(locale, content);
    res.send(content);
    res.end();
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

//app.get('/getinitialpage', function (req, res) {
//    res.setHeader('Content-Type', 'text/html');
//    var levelId = GetLevelId(req);
//    var locale = GetLocale(req);
//    switch (levelId) {
//        case -1:
//            var content = fileSystem.readFileSync("pages/login.html", "utf8");
//            content = TranslateString(locale, content);
//            res.send(content);
//            res.end();
//            break;
//        case 4:
//            var content = fileSystem.readFileSync("pages/issuetarget.html", "utf8");
//            content = TranslateString(locale, content);
//            res.send(content);
//            res.end();
//            break;
//    }


//});

app.get('/getloginpage', function (req, res) {
    SendPage("pages/login.html", req, res);
});


app.get('/getlevel', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var levelId = GetLevelId(req);
    res.send({ LevelId: levelId });
    res.end();


});

app.post('/login', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    dl.Login(Pool, req.body.Username, md5(req.body.Password), function (jsonResult) {
        req.session.levelid = (jsonResult == null ? -1 : jsonResult.levelid);
        res.send({ LevelId: (jsonResult == null ? -1 : jsonResult.levelid) });
        res.end();
    });

});

app.post('/translatestring', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    var locale = GetLocale(req);
    var trans = translate.Translate(locale, req.body.word, fileSystem);
    res.send({ Translate: trans });
    res.end();
});


app.get('/getissuetargetpage', function (req, res) {
    SendPage("pages/issuetarget.html", req, res);    
});


app.get('/getissuedescriptionpage', function (req, res) {
    SendPage("pages/issuedescription.html", req, res);
});

app.get('/getissuesexyearspage', function (req, res) {
    SendPage("pages/issuesexyears.html", req, res);
});

app.get('/getissuesymptomspage', function (req, res) {
    SendPage("pages/issuesymptoms.html", req, res);
});

app.get('/getsymptoms', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var locale = GetLocale(req);

    dl.GetSymptoms(Pool, function (jsonResult) {
        for (var group of jsonResult)
        {
            group.Name = translate.Translate(locale, group.Name, fileSystem);
            for (var sym of group.Symptoms)
                sym.Name = translate.Translate(locale, sym.Name, fileSystem);
        }
        
        res.send(jsonResult);
        res.end();
    });
});

app.get('/getissuesincepage', function (req, res) {
    SendPage("pages/issuesince.html", req, res);
});

app.get('/getsinces', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var locale = GetLocale(req);

    dl.GetSince(Pool, function (jsonResult) {
        for (var since of jsonResult.rows) {
            since.sincename = translate.Translate(locale, since.sincename, fileSystem);
        }

        res.send(jsonResult.rows);
        res.end();
    });
});


app.get('/getissueallergiespage', function (req, res) {
    SendPage("pages/issueallergies.html", req, res);
});


app.get('/getissuechronicspage', function (req, res) {
    SendPage("pages/issuechronics.html", req, res);
});

app.get('/getissuemedicinespage', function (req, res) {
    SendPage("pages/issuemedicines.html", req, res);
});


app.get('/getchronics', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var locale = GetLocale(req);

    dl.GetChronics(Pool, function (jsonResult) {
        for (var c of jsonResult.rows) {
            c.chronicname = translate.Translate(locale, c.chronicname, fileSystem);
        }

        res.send(jsonResult.rows);
        res.end();
    });
})


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

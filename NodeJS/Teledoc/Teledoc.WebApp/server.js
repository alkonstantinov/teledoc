'use strict';
const express = require('express')
const fileSystem = require('fs');
const session = require('express-session');
const url = require('url');
const pool = require('pg').Pool;
const path = require('path');
const bodyParser = require("body-parser");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const Busboy = require('busboy');

const translate = require('./js/translate/translate');
const dl = require('./js/dl/dl');


var transporter = nodemailer.createTransport({
    host: 'hopkins.host.bg',
    secureConnection: true,

    auth: {
        user: 'contact@birex43.com',
        pass: 'AAaa12345^'
    }
});




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
function getExtension(filename) {
    return filename.split('.').pop();
}
function Guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


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

function ThrowNoAccess(res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ errorCode: -1 });
    res.end();
}

function RequireLevel(level, req, res) {
    if (GetLevelId(req) != level) {
        ThrowNoAccess(res);
        return false;
    }
    return true;
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
        req.session.userid = (jsonResult == null ? -1 : jsonResult.userid);
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
    if (!RequireLevel(4, req, res))
        return;

    res.setHeader('Content-Type', 'application/json');
    var locale = GetLocale(req);

    dl.GetSymptoms(Pool, function (jsonResult) {
        for (var group of jsonResult) {
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
    if (!RequireLevel(4, req, res))
        return;

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
    if (!RequireLevel(4, req, res))
        return;

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

app.get('/getregisteruserpage', function (req, res) {
    SendPage("pages/registeruser.html", req, res);
});

app.post('/userexists', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    dl.UserExists(Pool, req.body.email, function (jsonResult) {
        res.send({ Exists: jsonResult });
        res.end();
    });
})

app.post('/registeruser', function (req, res) {

    var locale = GetLocale(req);
    var guid = Guid();
    var mailOptions = {
        from: 'contact@birex43.com',
        to: req.body.email,
        subject: translate.Translate(locale, "activationEmailSubject", fileSystem),
        html: translate.Translate(locale, "activationEmailText", fileSystem).replace("{guid}", guid)
    };
    transporter.sendMail(mailOptions, function (error, info) {

    });
    res.setHeader('Content-Type', 'application/json');

    dl.RegisterUser(Pool, req.body.email, md5(req.body.password), req.body.name, guid, function (jsonResult) {
        res.send({ ok: true });
        res.end();
    });
})

app.get('/activateuser', function (req, res) {


    dl.ActivateUser(Pool, req.query.guid, function (jsonResult) {
    });
    SendPage("pages/activation.html", req, res);
})


app.get('/getissueanswertypepage', function (req, res) {
    SendPage("pages/issueanswertype.html", req, res);
});

app.get('/getregisterdoctorpage', function (req, res) {
    SendPage("pages/registerdoctor.html", req, res);
});

app.post('/uploadimage', function (req, res) {
    var guid = Guid();


    var busboy = new Busboy({ headers: req.headers });
    req.pipe(busboy);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        guid += "." + getExtension(filename);
        var fstream = fileSystem.createWriteStream(__dirname + "/files/" + guid);
        file.pipe(fstream);
        file.on('end', function () {
            fstream.close();
            res.send({ imageId: guid });
            res.end();
        });
    });

});

app.get("/gettempimage", function (req, res) {
    var fstream = fileSystem.createReadStream(__dirname + "/files/" + req.query.fnm);
    fstream.pipe(res);
})

app.post("/registerdoctor", function (req, res) {
    var json = JSON.parse(req.body.json);
    json.Password = md5(json.Password);
    if (json.Fnm != "")
        json.img = '\\x' + fileSystem.readFileSync(__dirname + "/files/" + json.Fnm, 'hex');
    else
        json.img = '';
    dl.StoreDoctor(Pool, JSON.stringify(json), function () { });
    if (json.Fnm != "")
        fileSystem.unlink(__dirname + "/files/" + json.Fnm, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    res.end();
})

app.get('/getuserlistpage', function (req, res) {
    SendPage("pages/userlist.html", req, res);
});

app.post("/searchusers", function (req, res) {
    var locale = GetLocale(req);
    dl.SearchUsers(Pool, req.body.SS, req.body.Pos, req.body.PageSize, function (result) {
        if (result != null) {
            for (var r of result) {
                r.levelname = translate.Translate(locale, r.levelname, fileSystem);
                r.active = translate.Translate(locale, r.active + "", fileSystem);

            }
        }
        res.send(result);
        res.end();
    });


})

app.post("/changeactiveuser", function (req, res) {
    dl.ChangeActiveUser(Pool, req.body.UserId, function () {

        res.end();
    });


})


app.post("/getdoctor", function (req, res) {
    dl.GetDoctor(Pool, req.body.UserId, function (result) {
        res.send(result);
        res.end();
    });


})

app.get("/getdoctorimage", function (req, res) {
    dl.GetDoctorImage(Pool, req.query.UserId, function (result) {
        res.end(result, 'binary');
    });


})


app.get("/getmenu", function (req, res) {
    SendPage("pages/menu.html", req, res);

})

app.get("/logoff", function (req, res) {
    var sess = req.session;
    sess.levelid = -1;
    res.end();
})


app.get('/getpatientmain', function (req, res) {
    SendPage("pages/patientmain.html", req, res);
});

app.post("/getissuesnotclosed", function (req, res) {
    var locale = GetLocale(req);
    dl.GetIssuesNotClosed(Pool, req.session.userid, function (result) {
        if (result != null) {
            for (var r of result) {
                r.statusname = translate.Translate(locale, r.statusname, fileSystem);

            }
        }

        res.send(result);
        res.end();
    });


})


app.get('/getexpertmain', function (req, res) {
    SendPage("pages/expertmain.html", req, res);
});

app.post("/getissuesbyexpert", function (req, res) {
    dl.GetIssuesByExpert(Pool, req.session.levelid, function (result) {
        res.send(result);
        res.end();
    });


})

app.get('/getpreviewissue', function (req, res) {
    SendPage("pages/previewissue.html", req, res);
});

app.post("/getissue", function (req, res) {
    var locale = GetLocale(req);
    dl.GetIssue(Pool, req.body.issueId, function (result) {
        result.whoname = translate.Translate(locale, result.whoname, fileSystem);
        result.gendername = translate.Translate(locale, result.gendername, fileSystem);
        result.sincename = translate.Translate(locale, result.sincename, fileSystem);
        if (result.chronics != null)
            for (var item of result.chronics)
                item.chronicname = translate.Translate(locale, item.chronicname, fileSystem);

        if (result.medications != null)
            for (var item of result.medications)
                item.sincename = translate.Translate(locale, item.sincename, fileSystem);

        if (result.symptoms != null)
            for (var item of result.symptoms)
                item.symptomname = translate.Translate(locale, item.symptomname, fileSystem);
        
        res.send(result);
        res.end();
    });


})


app.post("/takeissue", function (req, res) {
    dl.AssignIssue(Pool, req.session.userid, req.body.issueId, function (result) {
        res.send(result);
        res.end();
    });


})


app.get('/getchangepasspage', function (req, res) {
    SendPage("pages/changepass.html", req, res);
});

app.post("/changepass", function (req, res) {    
    dl.ChangePass(Pool, req.session.userid, md5(req.body.password), function (result) {
        res.send("OK");
        res.end();
    });


})

app.get('/getlostpasspage', function (req, res) {
    SendPage("pages/lostpass.html", req, res);
});

app.post("/lostpassrenew", function (req, res) {
    var newPass = Math.floor((1 + Math.random()) * 10000);
    dl.ChangeLostPass(Pool, req.body.email, md5(newPass), function (result) {
        
    });

    var mailOptions = {
        from: 'contact@birex43.com',
        to: req.body.email,
        subject: translate.Translate(locale, "newPassEmailSubject", fileSystem),
        html: translate.Translate(locale, "newPassEmailText", fileSystem).replace("{pass}", newPass)
    };
    transporter.sendMail(mailOptions, function (error, info) {

    });
    res.send("OK");
    res.end();
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

'use strict';
const express = require('express')
const fileSystem = require('fs');
//const session = require('express-session');
const url = require('url');
const pool = require('pg').Pool;
const path = require('path');
const bodyParser = require("body-parser");
const md5 = require("md5");
const nodemailer = require('nodemailer');
const Busboy = require('busboy');

const translate = require('./js/translate/translate');
const dl = require('./js/dl/dl');

var ChatInfo = {
    User2Socket: {},
    Socket2User: {},
    Room2Users: {}
};

var Sessions = [];

function GetSession(sessionId) {
    for (var s of Sessions)
        if (s.sessionId === sessionId)
            return s;
    return AddSession(sessionId);
}

function AddSession(sessionId) {
    var s = {
        at: new
            Date().getTime(),
        sessionId: sessionId,
        locale: "bg",
        levelid: -1
    };
    Sessions.push(s);
    return s;
}

function SetSessionProperty(sessionId, property, value) {
    var s = GetSession(sessionId);
    s[property] = value;
    s.at = new Date().getTime();
}

function GetSessionProperty(sessionId, property) {
    var s = GetSession(sessionId);
    s.at = new Date().getTime();
    return s[property];
}


function RemoveSession(sessionId) {
    var id = -1;
    for (var i = 0; i < Sessions.length; i++)
        if (Sessions[i].sessionId == sessionId) {
            id = i;
            break;
        }
    if (id != -1)
        Sessions.splice(id, 1);
}


//---------------------------------------------------------------------

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



var port = 80;//process.env.PORT || 80;

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(session({ secret: 'VerySpecific', resave: true, saveUninitialized: true }));

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
    var sess = GetSession(req.body.sessionId);
    if (sess == null)
        sess = AddSession("S" + Guid());
    if (sess.locale == undefined)
        sess.locale = "bg";
    return sess.locale;

}

function GetLevelId(req) {
    var sess = GetSession(req.body.sessionId);
    if (sess == null)
        sess = AddSession("S" + Guid());
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
    SetSessionProperty(req.body.sessionId, "locale", req.body.locale)

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

app.get('/getsessionid', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ sessionId: AddSession("S" + Guid()).sessionId });
    res.end();


});


app.post('/getlevel', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var levelId = GetLevelId(req);
    res.send({ LevelId: levelId });
    res.end();


});

app.post('/login', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    dl.Login(Pool, req.body.Username, md5(req.body.Password), function (jsonResult) {


        var levelid = (jsonResult == null ? -1 : jsonResult.levelid);
        var userid = (jsonResult == null ? -1 : jsonResult.userid);
        SetSessionProperty(req.body.sessionId, "levelid", levelid);
        SetSessionProperty(req.body.sessionId, "userid", userid);

        res.send({ LevelId: levelid, UserId: userid, Name: (jsonResult == null ? "" : jsonResult.name) });
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

app.post('/getsymptoms', function (req, res) {
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

app.post('/getsinces', function (req, res) {
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


app.post('/getchronics', function (req, res) {
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
    //if (!RequireLevel(4, req, res) && !RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(1, req, res))
    //    return;

    var guid = Guid();


    var busboy = new Busboy({ headers: req.headers });
    req.pipe(busboy);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        guid += "." + getExtension(filename);
        var fstream = fileSystem.createWriteStream(__dirname + "/files/" + guid);
        file.pipe(fstream);
        file.on('end', function () {

            res.send({ imageId: guid });
            res.end();
            fstream.close();
        });
    });



});

app.get("/gettempimage", function (req, res) {
    var fstream = fileSystem.createReadStream(__dirname + "/files/" + req.query.fnm);
    fstream.pipe(res);
})

app.post("/registerdoctor", function (req, res) {
    if (!RequireLevel(1, req, res))
        return;
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
    if (!RequireLevel(1, req, res))
        return;
    var locale = GetLocale(req);
    dl.SearchUsers(Pool, req.body.SS, req.body.LevelId, req.body.Pos, req.body.PageSize, function (result) {
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
    if (!RequireLevel(1, req, res))
        return;
    dl.ChangeActiveUser(Pool, req.body.UserId, function () {

        res.end();
    });


})


app.post("/getdoctor", function (req, res) {
    if (!RequireLevel(1, req, res))
        return;
    dl.GetDoctor(Pool, req.body.UserId, function (result) {
        res.send(result);
        res.end();
    });


})

app.get("/getdoctorimage", function (req, res) {
    if (!RequireLevel(1, req, res))
        return;
    dl.GetDoctorImage(Pool, req.query.UserId, function (result) {
        res.end(result, 'binary');
    });


})


app.get("/getmenu", function (req, res) {
    SendPage("pages/menu.html", req, res);

})

app.post("/logoff", function (req, res) {
    RemoveSession(req.body.sessionId);
    res.end();
})


app.get('/getpatientmain', function (req, res) {
    SendPage("pages/patientmain.html", req, res);
});

app.post("/getissuesnotclosed", function (req, res) {
    if (!RequireLevel(4, req, res))
        return;
    var locale = GetLocale(req);
    dl.GetIssuesNotClosed(Pool, GetSessionProperty(req.body.sessionId, "userid"), function (result) {
        if (result != null) {
            for (var r of result) {
                r.statusname = translate.Translate(locale, r.statusname, fileSystem);

            }
        }

        res.send(result);
        res.end();
    });


})

app.post("/gettakenissues", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res))
        return;
    var locale = GetLocale(req);
    dl.GetIssuesTaken(Pool, GetSessionProperty(req.body.sessionId, "userid"), function (result) {
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
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res))
        return;
    dl.GetIssuesByExpert(Pool, GetSessionProperty(req.body.sessionId, "levelid"), function (result) {
        var locale = GetLocale(req);

        if (result != null) {
            for (var r of result) {
                r.statusname = translate.Translate(locale, r.statusname, fileSystem);

            }

        }
        res.send(result);
        res.end();
    });


})

app.get('/getpreviewissue', function (req, res) {
    SendPage("pages/previewissue.html", req, res);
});

app.post("/getissue", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res))
        return;
    var locale = GetLocale(req);
    dl.GetIssue(Pool, req.body.issueId, function (result) {
        result.whoname = translate.Translate(locale, result.whoname, fileSystem);
        result.gendername = translate.Translate(locale, result.gendername, fileSystem);
        result.sincename = translate.Translate(locale, result.sincename, fileSystem);
        result.answertypename = translate.Translate(locale, result.answertypename, fileSystem);
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
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res))
        return;
    dl.AssignIssue(Pool, GetSessionProperty(req.body.sessionId, "userid"), req.body.issueId, function (result) {
        res.send(result);
        res.end();
    });


})


app.get('/getchangepasspage', function (req, res) {
    SendPage("pages/changepass.html", req, res);
});

app.post("/changepass", function (req, res) {
    dl.ChangePass(Pool, GetSessionProperty(req.body.sessionId, "userid"), md5(req.body.password), function (result) {
        res.send("OK");
        res.end();
    });


})

app.get('/getlostpasspage', function (req, res) {
    SendPage("pages/lostpass.html", req, res);
});

app.post("/lostpassrenew", function (req, res) {
    var newPass = Math.floor((1 + Math.random()) * 10000) + "";
    var locale = GetLocale(req);
    dl.ChangeLostPass(Pool, req.body.email, md5(newPass), function (result) {

    });
    var mailOptions = {
        from: 'contact@birex43.com',
        to: req.body.email,
        subject: translate.Translate(locale, "newPassEmailSubject", fileSystem),
        html: translate.Translate(locale, "newPassEmailText", fileSystem).replace("{pass}", newPass)
    };
    transporter.sendMail(mailOptions, function (error, info) {
        var q = 3;
    });
    res.send("OK");
    res.end();
})


app.get('/getdashboardpage', function (req, res) {
    SendPage("pages/dashboard.html", req, res);
});

app.post("/dashboard", function (req, res) {
    if (!RequireLevel(1, req, res))
        return;
    dl.DashBoard(Pool, function (result) {
        res.send(result);
        res.end();
    });


})

app.post("/getlastissue", function (req, res) {
    if (!RequireLevel(4, req, res))
        return;
    var locale = GetLocale(req);
    dl.GetLastIssue(Pool, GetSessionProperty(req.body.sessionId, "userid"), req.body.whoId, function (result) {
        res.send(result);
        res.end();
    });


})


app.post("/getchat", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(4, req, res))
        return;

    var locale = GetLocale(req);
    dl.GetChat(Pool, req.body.issueId, function (result) {
        var msgs = [];
        for (var item of result) {
            var d = new Date(item.ondate)
            var time = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());


            msgs.push(
                {
                    message: item.said,
                    userid: item.userid,
                    name: item.name,
                    ontime: time,
                    chatid: item.chatid,
                    hasimg: item.hasimg
                }
            );
        }
        res.send(msgs);
        res.end();
    });


})

app.post("/setissue", function (req, res) {
    if (!RequireLevel(4, req, res))
        return;
    var json = JSON.parse(req.body.issue);
    json.patientuserid = GetSessionProperty(req.body.sessionId, "userid");


    dl.SetIssue(Pool, JSON.stringify(json), function (result) {
        res.send("OK");
        res.end();
    });


})

app.post("/caseclosed", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(4, req, res))
        return;
    dl.SetIssueStatus(Pool, req.body.issueId, 3, function (result) { res.end(); });
})




app.get('/getchatpage', function (req, res) {
    SendPage("pages/chat.html", req, res);
});

app.get("/getchatimage", function (req, res) {
    dl.GetChatImage(Pool, req.query.ChatId, function (result) {
        res.end(result, 'binary');
    });


})


app.post("/getclosedissues", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(4, req, res))
        return;
    dl.GetClosedIssues(Pool, GetSessionProperty(req.body.sessionId, "userid"), function (result) {
        res.send(result);
        res.end();
    });


})


app.post("/issuecanchat", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(4, req, res))
        return;
    dl.IssueCanChat(Pool, req.body.issueId, function (result) {
        res.send(result);
        res.end();
    });


})

app.post("/restartchat", function (req, res) {
    if (!RequireLevel(2, req, res) && !RequireLevel(3, req, res) && !RequireLevel(4, req, res))
        return;
    dl.SetIssueStatus(Pool, req.body.issueId, 2, function (result) {
        res.send(result);
        res.end();
    });


})

app.get("/whoami", function (req, res) {
    res.send({ userid: GetSessionProperty(req.body.sessionId, "userid") });
    res.end();

})

app.get("/messagetranslations", function (req, res) {
    var locale = GetLocale(req);

    res.send({
        NewMessage: translate.Translate(locale, "NewMessage", fileSystem),
        CloseChatMessage: translate.Translate(locale, "CloseChatMessage", fileSystem)
    });
    res.end();

})


//--------------------------------------------------------------
app.get('*', function (req, res) {
    //res.send("-1");
    res.send(translate.Translate('bg', 'login', fileSystem));
    res.end();
});



//var fs = require('fs');

var io = require('socket.io').listen(

    app.listen(port, "0.0.0.0", function () {

        console.log('Example app listening on ' + port + '!')
    })

);

io.sockets.on('connection', function (socket) {

    socket.on('room', function (room) {
        socket.join(room);
        var roomId = parseInt(room.substring(6));
        if (ChatInfo.Room2Users[room] == null) {
            var users = dl.IssueGetChatUsers(Pool, roomId, function (result) {
                ChatInfo.Room2Users[room] = {
                    User1: result.user1id,
                    User2: result.user2id
                };

            });
        }

    });



    //var ChatInfo = {
    //    User2Socket: {},
    //    Socket2User: {},
    //    Room2Users: {}
    //};

    socket.on('iam', function (userId) {
        if (userId != null) {
            ChatInfo.Socket2User[socket.id] = userId;
            ChatInfo.User2Socket["u" + userId] = socket;
        }
    });


    socket.on('send', function (data) {
        var d = new Date();
        var time = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());

        data.ontime = time;
        dl.ChatNewItem(Pool, data.issueId, data.userid, data.message, null, function (result) {
            data.chatid = result;
            //io.sockets.in(data.room).emit('message', data);
            var u1 = ChatInfo.Room2Users[data.room].User1;
            if (u1 != null) {
                var socket = ChatInfo.User2Socket["u" + u1];
                if (socket != null)
                    socket.emit('message', data);
            }
            var u2 = ChatInfo.Room2Users[data.room].User2;
            if (u2 != null) {
                var socket = ChatInfo.User2Socket["u" + u2];
                if (socket != null)
                    socket.emit('message', data);
            }

        });


    });
    socket.on('endchat', function (data) {
        io.sockets.in(data.room).emit('endchat', data);
        dl.SetIssueStatus(Pool, data.issueId, 3, function (result) { });

    });
    socket.on('sendimage', function (data) {
        var d = new Date();
        var time = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes());

        data.ontime = time;
        var img = '\\x' + fileSystem.readFileSync(__dirname + "/files/" + data.fnm, 'hex');
        dl.ChatNewItem(Pool, data.issueId, data.userid, '', img, function (result) {
            data.chatid = result;
            data.hasimg = true;
            var u1 = ChatInfo.Room2Users[data.room].User1;
            if (u1 != null) {
                var socket = ChatInfo.User2Socket["u" + u1];
                if (socket != null)
                    socket.emit('messageimage', data);
            }
            var u2 = ChatInfo.Room2Users[data.room].User2;
            if (u2 != null) {
                var socket = ChatInfo.User2Socket["u" + u2];
                if (socket != null)
                    socket.emit('messageimage', data);
            }
        });
    });
});

process.on('uncaughtException', (err) => {
    console.log('=================================\n');
    console.log(err);
    console.log('=================================\n');
});


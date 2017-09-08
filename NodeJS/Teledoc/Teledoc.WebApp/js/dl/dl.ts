var exports: any;

exports.Test = function (pool, callback) {
    pool.query('select * from admin.f_get_users();', function (err, result) {
        var respResult = [];
        for (var row of result.rows)
            respResult.push(row);
        callback(respResult);
    });



};


exports.Login = function (pool, username, password, callback) {
    pool.query("select * from login('" + username + "', '" + password + "');", function (err, result) {
        var respResult = (result.rows.length > 0 ? result.rows[0] : null);
        callback(respResult);
    });



};



exports.GetSymptoms = function (pool, callback) {
    pool.query('select * from pSymptomSelect ()', function (err, result) {
        var respResult = [];
        for (var row of result.rows) {
            if (row.symptomparentid == null) {
                respResult.push({
                    Id: row.symptomid,
                    Name: row.symptomname,
                    Symptoms: []
                });
            }
            else {
                respResult[respResult.length - 1].Symptoms.push(
                    {
                        Id: row.symptomid,
                        Name: row.symptomname
                    });
            }
        }

        callback(respResult);
    });



};


exports.GetSince = function (pool, callback) {
    pool.query("select * from psinceselect();", function (err, result) {

        callback(result);
    });



};

exports.GetChronics = function (pool, callback) {
    pool.query("select * from pchronicselect();", function (err, result) {

        callback(result);
    });



};

exports.UserExists = function (pool, username, callback) {
    pool.query("select * from pLoginExists('" + username + "');", function (err, result) {
        var respResult = result.rows != null && result.rows.length > 0;
        callback(respResult);
    });
};

exports.RegisterUser = function (pool, username, password, name, activationstring, callback) {
    pool.query("select * from pUserRegister('" + username + "','" + password + "', '" + name + "', '" + activationstring + "');", function (err, result) {

        callback(result);
    });
};

exports.ActivateUser = function (pool, activationstring, callback) {
    pool.query("select * from pUserActivate('" + activationstring + "');", function (err, result) {

        callback(result);
    });
};

exports.StoreDoctor = function (pool, json, callback) {
    pool.query("select * from pDoctorSet('" + json + "');", function (err, result) {
        callback(result);
    });



};



exports.SearchUsers = function (pool, ss, pos, pagesize, callback) {
    pool.query("select * from pusersearch ('" + ss + "'," + pos + "," + pagesize + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows);
    });



};

exports.ChangeActiveUser = function (pool, userid, callback) {
    pool.query("select * from puserchangeactive (" + userid + ")", function (err, result) {
        callback();
    });



};

exports.GetDoctor = function (pool, userid, callback) {
    pool.query("select * from pDoctorGet (" + userid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows[0]);
    });
};

exports.GetDoctorImage = function (pool, userid, callback) {
    pool.query("select * from pDoctorImageGet (" + userid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows[0].img);
    });
};


exports.GetIssuesNotClosed = function (pool, userid, callback) {
    pool.query("select * from pIssueGetNotClosed (" + userid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows);
    });
};

exports.GetIssuesTaken = function (pool, userid, callback) {
    pool.query("select * from pIssueGetTaken (" + userid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows);
    });
};


exports.GetIssuesByExpert = function (pool, levelid, callback) {
    pool.query("select * from pIssueGetByExpert (" + levelid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows);
    });
};

exports.GetIssue = function (pool, issueId, callback) {
    pool.query("select * from pIssueGet (" + issueId + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows[0].pissueget);
    });
};

exports.AssignIssue = function (pool, userId, issueId, callback) {
    pool.query("select * from pIssueAssign('" + issueId + "', '" + userId + "');", function (err, result) {
        callback(null);
    });



};

exports.ChangePass = function (pool, userId, password, callback) {
    pool.query("select * from pUserChangePass('" + userId + "', '" + password + "');", function (err, result) {
        callback(null);
    });
};

exports.ChangeLostPass = function (pool, userId, password, callback) {
    pool.query("select * from pChangeLostPass('" + userId + "', '" + password + "');", function (err, result) {
        callback(null);
    });
};

exports.DashBoard = function (pool, callback) {
    pool.query("select * from pDashBoard();", function (err, result) {
        callback(result.rows[0]);
    });
};

exports.GetLastIssue = function (pool, userId, whoId, callback) {

    pool.query("select * from pIssueLastGet(" + userId + ", " + whoId + ");", function (err, result) {
        exports.GetIssue(pool, result.rows[0].issueid, callback);
    });
};

exports.SetIssue = function (pool, json, callback) {
    pool.query("select * from pIssueSet('" + json + "');", function (err, result) {
        callback(result);
    });
};


exports.ChatNewItem = function (pool, issueId, userId, said, img, callback) {
    var qry = "select * from pChatNewItem(" + issueId + ", " + userId + ", '" + said + "', " + (img == null ? 'null' : "'" + img + "'") + ");";
    pool.query(qry, function (err, result) {
        callback(result.rows[0].pchatnewitem);
    });
};

exports.GetChat = function (pool, issueId, callback) {
    pool.query("select * from pChatGet(" + issueId + ");", function (err, result) {
        callback(result.rows);
    });
};

exports.GetChatImage = function (pool, chatid, callback) {
    pool.query("select * from pChatImageGet (" + chatid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows[0].img);
    });
};

exports.SetIssueStatus = function (pool, issueId, statusId, callback) {
    pool.query("select * from pIssueSetStatus(" + issueId + ", " + statusId + ");", function (err, result) {
        callback(result);
    });



};

exports.GetClosedIssues = function (pool, userid, callback) {
    pool.query("select * from pIssueGetClosed (" + userid + ")", function (err, result) {
        if (result == null)
            callback(null);
        else
            callback(result.rows);
    });
};


exports.IssueCanChat = function (pool, issueid, callback) {
    pool.query("select * from pIssueCanChat(" + issueid+");", function (err, result) {

        callback(result.rows[0].pissuecanchat);
    });



};
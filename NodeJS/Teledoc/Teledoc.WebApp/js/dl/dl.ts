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

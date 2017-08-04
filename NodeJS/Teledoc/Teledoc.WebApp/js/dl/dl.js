var exports;
exports.Test = function (pool, callback) {
    pool.query('select * from admin.f_get_users();', function (err, result) {
        var respResult = [];
        for (var _i = 0, _a = result.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            respResult.push(row);
        }
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
        for (var _i = 0, _a = result.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            if (row.symptomparentid == null) {
                respResult.push({
                    Id: row.symptomid,
                    Name: row.symptomname,
                    Symptoms: []
                });
            }
            else {
                respResult[respResult.length - 1].Symptoms.push({
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
//# sourceMappingURL=dl.js.map
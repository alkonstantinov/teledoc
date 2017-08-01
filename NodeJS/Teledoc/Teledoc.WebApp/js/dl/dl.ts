var exports: any;

exports.Test = function (pool,callback) {
    pool.query('select * from admin.f_get_users();', function (err, result) {
        var respResult = [];
        for (var row of result.rows)
            respResult.push(row);
        callback(respResult);
    });



};


exports.Login = function (pool, username, password, callback) {
    pool.query("select * from login('" + username + "', '" + password + "');", function (err, result) {
        var respResult = (result.rows.length > 0 ? result.rows[0]:null);
        callback(respResult);
    });



};
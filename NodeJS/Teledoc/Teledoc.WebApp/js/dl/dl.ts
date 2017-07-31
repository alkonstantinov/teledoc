var exports: any;

exports.Test = function (pool,callback) {
    pool.query('select * from admin.f_get_users();', function (err, result) {
        var respResult = [];
        for (var row of result.rows)
            respResult.push(row);
        callback(respResult);
    });

};
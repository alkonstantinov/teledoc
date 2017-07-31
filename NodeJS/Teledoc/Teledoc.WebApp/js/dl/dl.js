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
//# sourceMappingURL=dl.js.map
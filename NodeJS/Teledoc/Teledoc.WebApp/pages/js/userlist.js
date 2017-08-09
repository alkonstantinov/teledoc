var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UserList = (function (_super) {
    __extends(UserList, _super);
    function UserList() {
        return _super.call(this) || this;
    }
    UserList.prototype.Search = function (page) {
        $("#hCurrentPage").val(page);
        var pos = (page - 1) * this.pageSize;
        var result = Comm.POST("/searchusers", {
            SS: $("#tbSS").val(),
            Pos: pos,
            PageSize: this.pageSize
        });
        if (result == null) {
            $("#tUsers").hide();
            $("#dNoRecords").show();
        }
        else {
            var pageCount = Math.floor(result[0].total / this.pageSize) + ((result[0].total % this.pageSize > 0) ? 1 : 0);
            $("#ddlPage").empty();
            for (var i = 1; i <= pageCount; i++) {
                $("#ddlPage").append("<option value='" + i + "' " + (i == page ? "selected" : "") + ">" + i + "</option>");
            }
            $("#tUsers").show();
            $("#tUsers tbody").empty();
            $("#dNoRecords").hide();
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var r = result_1[_i];
                $("#tUsers tbody").append("<tr>" +
                    "<td>" + r.username + "</td>" +
                    "<td>" + r.levelname + "</td>" +
                    "<td>" + (r.name == null ? "" : r.name) + "</td>" +
                    "<td><button class='btn btn-primary' onclick='userList.ChangeActiveUser(" + r.userid + ")'>" + r.active + "</button></td>" +
                    ((r.levelid == 2 || r.levelid == 3) ?
                        "<td><span class='glyphicon glyphicon-edit pull-right' aria-hidden='true' onclick='userList.EditUser(" + r.userid + ")'></span></td>" :
                        "<td> </td>") +
                    "</tr>");
            }
        }
    };
    UserList.prototype.ChangeActiveUser = function (userId) {
        Comm.POST("/changeactiveuser", { UserId: userId });
        this.Search($("#hCurrentPage").val());
    };
    UserList.prototype.EditUser = function (userId) {
        parent.location.hash = "registerdoctor" + (userId != null ? "|" + userId : "");
        BasePage.LoadCurrentPage();
    };
    return UserList;
}(BasePage));
//# sourceMappingURL=userlist.js.map
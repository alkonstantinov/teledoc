﻿declare var $: any;
declare var userList: UserList;

class UserList extends BasePage {

    public Search(page) {
        $("#hCurrentPage").val(page);
        var pos = (page - 1) * this.pageSize;

        var result = Comm.POST("/searchusers", {
            SS: $("#tbSS").val(),
            LevelId: parseInt($("#ddlLevel").val()),
            Pos: pos,
            PageSize: this.pageSize

        });

        if (result == null || result.length == 0) {
            $("#tUsers").hide();
            $("#dNoRecords").show();
        }
        else {
            var pageCount = Math.floor(result[0].total / this.pageSize) + ((result[0].total % this.pageSize > 0) ? 1 : 0);
            $("#ddlPage").empty();
            for (var i = 1; i <= pageCount; i++) {
                $("#ddlPage").append("<option value='" + i + "' " + (i == page ? "selected" : "") + ">" + i + "</option>")
            }
            $("#tUsers").show();
            $("#tUsers tbody").empty();
            $("#dNoRecords").hide();
            for (var r of result) {
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
    }

    public ChangeActiveUser(userId) {
        Comm.POST("/changeactiveuser", { UserId: userId });
        this.Search($("#hCurrentPage").val());
    }

    public EditUser(userId) {
        BasePage.GotoPage("registerdoctor" + (userId != null ? "|" + userId : ""));

    }
    constructor() {

        super();

    }

}



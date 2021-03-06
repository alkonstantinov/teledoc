var BasePage = (function () {
    function BasePage() {
        this.pageSize = 20;
    }
    BasePage.ShapeImage = function (img, maxSize) {
        var width = img.clientWidth;
        var height = img.clientHeight;
        var r = 1;
        if (width > height) {
            r = width / maxSize;
        }
        else {
            r = height / maxSize;
        }
        $(img).width(Math.round(width / r));
        $(img).height(Math.round(height / r));
    };
    BasePage.Guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    BasePage.ApplyNumbersOnly = function () {
        $(".numbersonly").keyup(function (e) {
            this.value = this.value.replace(/[^0-9]/gi, '');
        });
        $(".numbersdotonly").keyup(function (e) {
            this.value = this.value.replace(/[^0-9\.,]/gi, '');
            this.value = this.value.replace(/,/gi, '.');
        });
    };
    BasePage.prototype.parseJsonDate = function (jsonDateString) {
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    };
    BasePage.LoadPage = function (fnm) {
        var d = new Date();
        $("#dContent").load("app/pages/" + fnm + "?" + d.getUTCMilliseconds());
    };
    BasePage.PostgreTimestamp = function (dt) {
        var date = new Date(dt);
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
    };
    BasePage.Logout = function () {
        parent.location.hash = "";
        //!!!!!!!!!!! изпращане на сигнал за логаут
        var page = Comm.GET("/getloginpage");
        $("#dContent").html(page);
        BasePage.LoadCurrentPage();
    };
    BasePage.NavigateTo = function (hash) {
        parent.location.hash = hash;
        BasePage.LoadCurrentPage();
    };
    BasePage.GotoPage = function (hash) {
        parent.location.hash = hash;
        BasePage.LoadCurrentPage();
    };
    BasePage.LoadCurrentPage = function () {
        var level = Comm.POST("/getlevel", {});
        var page = null;
        if (parent.location.hash.search("registeruser") > -1)
            page = Comm.GET("/getregisteruserpage");
        else if (parent.location.hash.search("lostpass") > -1)
            page = Comm.GET("/getlostpasspage");
        else if (level.LevelId === -1) {
            page = Comm.GET("/getloginpage");
        }
        else {
            if (parent.location.hash == "") {
                switch (level.LevelId) {
                    case 1:
                        page = Comm.GET("/getdashboardpage");
                        break;
                    case 2:
                        page = Comm.GET("/getexpertmain");
                        break;
                    case 3:
                        page = Comm.GET("/getexpertmain");
                        break;
                    case 4:
                        page = Comm.GET("/getpatientmain");
                        break;
                }
            }
            if (parent.location.hash.search("loginpage") > -1)
                page = Comm.GET("/getloginpage");
            if (parent.location.hash.search("issuetarget") > -1)
                page = Comm.GET("/getissuetargetpage");
            if (parent.location.hash.search("issuedescription") > -1)
                page = Comm.GET("/getissuedescriptionpage");
            if (parent.location.hash.search("issuesexyears") > -1) {
                page = Comm.GET("/getissuesexyearspage");
            }
            if (parent.location.hash.search("issuesymptoms") > -1)
                page = Comm.GET("/getissuesymptomspage");
            if (parent.location.hash.search("issuesince") > -1) {
                page = Comm.GET("/getissuesincepage");
            }
            if (parent.location.hash.search("issueallergies") > -1) {
                page = Comm.GET("/getissueallergiespage");
            }
            if (parent.location.hash.search("issuechronics") > -1) {
                page = Comm.GET("/getissuechronicspage");
            }
            if (parent.location.hash.search("issuemedicines") > -1) {
                page = Comm.GET("/getissuemedicinespage");
            }
            if (parent.location.hash.search("issueanswertype") > -1) {
                page = Comm.GET("/getissueanswertypepage");
            }
            if (parent.location.hash.search("registerdoctor") > -1)
                page = Comm.GET("/getregisterdoctorpage");
            if (parent.location.hash.search("userlist") > -1)
                page = Comm.GET("/getuserlistpage");
            if (parent.location.hash.search("patientmain") > -1)
                page = Comm.GET("/getpatientmain");
            if (parent.location.hash.search("expertmain") > -1)
                page = Comm.GET("/getexpertmain");
            if (parent.location.hash.search("previewissue") > -1)
                page = Comm.GET("/getpreviewissue");
            if (parent.location.hash.search("changepass") > -1)
                page = Comm.GET("/getchangepasspage");
            if (parent.location.hash.search("dashboard") > -1)
                page = Comm.GET("/getdashboardpage");
            if (parent.location.hash.search("chat") > -1)
                page = Comm.GET("/getchatpage");
        }
        $("#dContent").html(page);
        window.scrollTo(0, 0);
        var menu = Comm.GET("/getmenu");
        $("#dMenu").html(menu);
        switch (level.LevelId) {
            case -1:
                $("#dMenu").hide();
                break;
            case 1:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").show();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 2:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 3:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 4:
                $("#dMenu").show();
                $("#miNewIssue").show();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
        }
    };
    BasePage.HideErrors = function () {
        $("div[id^='lErr']").hide();
    };
    BasePage.SaveIssue = function (issue) {
        localStorage.setItem("Issue", JSON.stringify(issue));
    };
    BasePage.LoadIssue = function () {
        var issueText = localStorage.getItem("Issue");
        if (issueText == null)
            return null;
        else
            return JSON.parse(issueText);
    };
    BasePage.RemoveIssue = function () {
        localStorage.removeItem("Issue");
    };
    BasePage.SaveLogin = function (loginResult) {
        localStorage.setItem("Login", JSON.stringify(loginResult));
    };
    BasePage.LoadLogin = function () {
        var loginResult = localStorage.getItem("Login");
        if (loginResult == null)
            return null;
        else
            return JSON.parse(loginResult);
    };
    return BasePage;
}());
//# sourceMappingURL=basepage.js.map
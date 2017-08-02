var BasePage = (function () {
    function BasePage() {
    }
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
    BasePage.LoadCurrentPage = function () {
        var level = Comm.GET("/getlevel");
        var page = null;
        if (level.LevelId === -1) {
            page = Comm.GET("/getloginpage");
        }
        else {
            if (parent.location.hash.search("issuetarget") > -1)
                page = Comm.GET("/getissuetargetpage");
            if (parent.location.hash.search("issuedescription") > -1)
                page = Comm.GET("/getissuedescriptionpage");
            if (parent.location.hash.search("issuesexyears") > -1)
                page = Comm.GET("/getissuesexyearspage");
        }
        $("#dContent").html(page);
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
    return BasePage;
}());
//# sourceMappingURL=basepage.js.map
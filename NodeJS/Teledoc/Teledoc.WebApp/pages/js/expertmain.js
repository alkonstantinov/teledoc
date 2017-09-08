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
var ExpertMain = (function (_super) {
    __extends(ExpertMain, _super);
    function ExpertMain() {
        return _super.call(this) || this;
    }
    ExpertMain.prototype.LoadPendingIssues = function () {
        var issues = Comm.POST("/getissuesbyexpert", {});
        if (issues == null)
            return;
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var _i = 0, issues_1 = issues; _i < issues_1.length; _i++) {
            var issue = issues_1[_i];
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>";
            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }
    };
    ExpertMain.prototype.LoadTakenIssues = function () {
        var issues = Comm.POST("/gettakenissues", {});
        $("#tTakenIssues").empty();
        if (issues == null)
            return;
        for (var _i = 0, issues_2 = issues; _i < issues_2.length; _i++) {
            var issue = issues_2[_i];
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";
            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td><td>";
            switch (issue.answertypeid) {
                case 1:
                    row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='expertMain.OpenChat(" + issue.issueid + ")'></span>";
                    break;
                case 2:
                    row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>";
                    break;
                case 3:
                    row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>";
                    break;
            }
            row += "</td><td><span class='glyphicon glyphicon-ok pull-right' aria-hidden='true' onclick='expertMain.CaseClosed(" + issue.issueid + ")'></span></td></tr>";
            $("#tTakenIssues").append(row);
        }
    };
    ExpertMain.prototype.LoadClosedIssues = function () {
        var issues = Comm.POST("/getclosedissues", {});
        $("#tClosedIssues").empty();
        if (issues == null)
            return;
        for (var _i = 0, issues_3 = issues; _i < issues_3.length; _i++) {
            var issue = issues_3[_i];
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>";
            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            switch (issue.answertypeid) {
                case 1:
                    row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='expertMain.OpenChat(" + issue.issueid + ")'></span>" +
                        "<span class='glyphicon glyphicon-refresh pull-right' aria-hidden='true' onclick='expertMain.RestartChat(" + issue.issueid + ")'></span>";
                    break;
                case 2:
                    row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>";
                    break;
                case 3:
                    row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>";
                    break;
            }
            row += "</td></tr>";
            $("#tClosedIssues").append(row);
        }
    };
    ExpertMain.prototype.CaseClosed = function (issueId) {
        Comm.POST("/caseclosed", { issueId: issueId });
        BasePage.GotoPage("");
    };
    ExpertMain.prototype.RestartChat = function (issueId) {
        Comm.POST("/restartchat", { issueId: issueId });
        BasePage.GotoPage("");
    };
    ExpertMain.prototype.OpenChat = function (issueId) {
        BasePage.GotoPage("chat|" + issueId);
    };
    ExpertMain.prototype.Preview = function (issueId) {
        BasePage.GotoPage("previewissue|" + issueId);
    };
    return ExpertMain;
}(BasePage));
//# sourceMappingURL=expertmain.js.map
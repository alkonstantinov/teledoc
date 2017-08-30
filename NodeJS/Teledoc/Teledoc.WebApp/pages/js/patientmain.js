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
var PatientMain = (function (_super) {
    __extends(PatientMain, _super);
    function PatientMain() {
        return _super.call(this) || this;
    }
    PatientMain.prototype.LoadPendingIssues = function () {
        var issues = Comm.POST("/getissuesnotclosed", {});
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var _i = 0, issues_1 = issues; _i < issues_1.length; _i++) {
            var issue = issues_1[_i];
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";
            if (issue.statusid == 2) {
                switch (issue.answertypeid) {
                    case 1:
                        row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='patientMain.OpenChat(" + issue.issueid + ")'></span>";
                        break;
                    case 2:
                        row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>";
                        break;
                    case 3:
                        row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>";
                        break;
                }
            }
            row += "</td></tr>";
            $("#tIssues").append(row);
        }
    };
    PatientMain.prototype.NewIssue = function () {
        parent.location.hash = "issuetarget";
        BasePage.LoadCurrentPage();
    };
    PatientMain.prototype.OpenChat = function (issueId) {
        parent.location.hash = "chat|" + issueId;
        BasePage.LoadCurrentPage();
    };
    return PatientMain;
}(BasePage));
//# sourceMappingURL=patientmain.js.map
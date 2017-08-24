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
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var _i = 0, issues_1 = issues; _i < issues_1.length; _i++) {
            var issue = issues_1[_i];
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";
            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }
    };
    ExpertMain.prototype.Preview = function (issueId) {
        parent.location.hash = "previewissue|" + issueId;
        BasePage.LoadCurrentPage();
    };
    return ExpertMain;
}(BasePage));
//# sourceMappingURL=expertmain.js.map
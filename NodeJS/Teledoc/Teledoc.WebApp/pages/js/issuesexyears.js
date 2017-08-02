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
var IssueSexYears = (function (_super) {
    __extends(IssueSexYears, _super);
    function IssueSexYears() {
        return _super.call(this) || this;
    }
    IssueSexYears.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.sexid != null) {
            switch (issue.sexid) {
                case "m":
                    $("#rbMale").prop("checked", true);
                    break;
                case "f":
                    $("#rbFemale").prop("checked", true);
                    break;
                case "b":
                    $("#rbOther").prop("checked", true);
                    break;
            }
        }
        if (issue.birthmonth != null) {
            $("#ddlMonth").val(issue.birthmonth);
        }
        if (issue.birthyear != null) {
            $("#ddlYear").val(issue.birthyear);
        }
    };
    IssueSexYears.prototype.Next = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if ($("#rbMale").prop("checked"))
            issue.sexid = "m";
        if ($("#rbFemale").prop("checked"))
            issue.sexid = "f";
        if ($("#rbOther").prop("checked"))
            issue.sexid = "b";
        issue.birthmonth = $("#ddlMonth").val();
        issue.birthyear = $("#ddlYear").val();
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuesymptoms");
    };
    IssueSexYears.prototype.Prev = function () {
        BasePage.NavigateTo("issuedescription");
    };
    ;
    return IssueSexYears;
}(BasePage));
//# sourceMappingURL=issuesexyears.js.map
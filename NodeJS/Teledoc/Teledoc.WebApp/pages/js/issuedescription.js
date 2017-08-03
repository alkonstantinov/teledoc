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
var IssueDescription = (function (_super) {
    __extends(IssueDescription, _super);
    function IssueDescription() {
        return _super.call(this) || this;
    }
    IssueDescription.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.description != null) {
            $("#tbDesc").val(issue.description);
        }
    };
    IssueDescription.prototype.Save = function () {
        var error = false;
        BasePage.HideErrors();
        if ($("#tbDesc").val() == "") {
            error = true;
            $("#lErrtbDesc").show();
        }
        if (error)
            return false;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.description = $("#tbDesc").val();
        BasePage.SaveIssue(issue);
        return true;
    };
    IssueDescription.prototype.Next = function () {
        if (this.Save())
            BasePage.NavigateTo("issuesexyears");
    };
    IssueDescription.prototype.Prev = function () {
        if (this.Save())
            BasePage.NavigateTo("issuetarget");
    };
    ;
    return IssueDescription;
}(BasePage));
//# sourceMappingURL=issuedescription.js.map
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
var IssueAnswerType = (function (_super) {
    __extends(IssueAnswerType, _super);
    function IssueAnswerType() {
        return _super.call(this) || this;
    }
    IssueAnswerType.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.answertypeid != null) {
            switch (issue.answertypeid) {
                case 1:
                    $("#rbChat").prop("checked", true);
                    break;
                case 2:
                    $("#rbeMail").prop("checked", true);
                    $("#tbEmail").val(issue.additionalinfo);
                    break;
                case 3:
                    $("#rbCall").prop("checked", true);
                    $("#tbPhone").val(issue.additionalinfo);
                    break;
            }
        }
    };
    IssueAnswerType.prototype.Save = function () {
        var error = false;
        BasePage.HideErrors();
        if ($("#rbeMail").prop("checked") && !/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbEmail").val())) {
            error = true;
            $("#lErrtbEmail").show();
        }
        if ($("#rbCall").prop("checked") && $("#tbPhone").val() == "") {
            error = true;
            $("#lErrtbPhone").show();
        }
        if (error)
            return false;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if ($("#rbeMail").prop("checked")) {
            issue.answertypeid = 2;
            issue.additionalinfo = $("#tbEmail").val();
        }
        if ($("#rbCall").prop("checked")) {
            issue.answertypeid = 3;
            issue.additionalinfo = $("#tbPhone").val();
        }
        if ($("#rbChat").prop("checked")) {
            issue.answertypeid = 1;
        }
        BasePage.SaveIssue(issue);
        return true;
    };
    IssueAnswerType.prototype.Next = function () {
        if (this.Save()) {
            var issue = BasePage.LoadIssue();
            debugger;
            Comm.POST("/setissue", { issue: JSON.stringify(issue) });
            BasePage.RemoveIssue();
            BasePage.GotoPage("patientmain");
        }
    };
    IssueAnswerType.prototype.Prev = function () {
        if (this.Save())
            BasePage.NavigateTo("issuemedicines");
    };
    ;
    return IssueAnswerType;
}(BasePage));
//# sourceMappingURL=issueanswertype.js.map
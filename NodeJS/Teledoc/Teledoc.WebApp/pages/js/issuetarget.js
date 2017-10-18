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
var IssueTarget = (function (_super) {
    __extends(IssueTarget, _super);
    function IssueTarget() {
        return _super.call(this) || this;
    }
    IssueTarget.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            return;
        if (issue.whoid != null) {
            if (issue.whoid == 1)
                $("#rbMe").prop("checked", true);
            else
                $("#rbMyChild").prop("checked", true);
        }
        if (issue.reqexpertlevelid != null) {
            if (issue.reqexpertlevelid == 2)
                $("#rbDoctor").prop("checked", true);
            else
                $("#rbPharmacist").prop("checked", true);
        }
    };
    IssueTarget.prototype.Next = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if ($("#rbMe").prop("checked"))
            issue.whoid = 1;
        else
            issue.whoid = 2;
        if ($("#rbDoctor").prop("checked"))
            issue.reqexpertlevelid = 2;
        else
            issue.reqexpertlevelid = 3;
        var oldIssue = Comm.POST("/getlastissue", { whoId: issue.whoid });
        if (oldIssue != null) {
            issue.allergy = oldIssue.allergies;
            issue.answertypeid = oldIssue.answertypeid;
            issue.additionalinfo = oldIssue.additionalinfo;
            issue.chronic = oldIssue.chronics;
            //issue.description = oldIssue.description;
            //issue.medication = oldIssue.medications;
            issue.sexid = oldIssue.genderid;
            issue.birthmonth = oldIssue.birthmonth;
            issue.birthyear = oldIssue.birthyear;
        }
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuedescription");
    };
    return IssueTarget;
}(BasePage));
//# sourceMappingURL=issuetarget.js.map
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
var IssueSince = (function (_super) {
    __extends(IssueSince, _super);
    function IssueSince() {
        return _super.call(this) || this;
    }
    IssueSince.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var sinces = Comm.GET("/getsinces");
        for (var _i = 0, sinces_1 = sinces; _i < sinces_1.length; _i++) {
            var since = sinces_1[_i];
            $("#dSince").append("<div class='row'><div class='col-md-12'><div class='radio'><label><input type='radio' class='form-control' name='since' sinceid='" + since.sinceid + "'>" + since.sincename + "</label></div></div>");
        }
        $("input[type='radio']").first().prop("checked", true);
        if (issue.sinceid != null) {
            $("input[sinceid='" + issue.sinceid + "']").prop("checked", true);
        }
    };
    IssueSince.prototype.Save = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.sinceid = $("input[type='radio']:checked").attr("sinceid");
        BasePage.SaveIssue(issue);
    };
    IssueSince.prototype.Next = function () {
        this.Save();
        BasePage.NavigateTo("issuechronics");
    };
    IssueSince.prototype.Prev = function () {
        this.Save();
        BasePage.NavigateTo("issuesymptoms");
    };
    ;
    return IssueSince;
}(BasePage));
//# sourceMappingURL=issuesince.js.map
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
var IssueSymptoms = (function (_super) {
    __extends(IssueSymptoms, _super);
    function IssueSymptoms() {
        return _super.call(this) || this;
    }
    IssueSymptoms.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var symptoms = Comm.GET("/getsymptoms");
        for (var _i = 0, symptoms_1 = symptoms; _i < symptoms_1.length; _i++) {
            var group = symptoms_1[_i];
            $("#dSymptoms").append("<div class='row'><div class='col-md-12'><div class='label-info'>" + group.Name + "</div></div></div>");
            for (var _a = 0, _b = group.Symptoms; _a < _b.length; _a++) {
                var sym = _b[_a];
                $("#dSymptoms").append("<div class='row'><div class='col-md-12'><div class='checkbox'><label><input type='checkbox' class='form-control' symptomid='" + sym.Id + "'>" + sym.Name + "</label></div></div>");
            }
        }
        if (issue.symptom != null) {
            for (var _c = 0, _d = issue.symptom; _c < _d.length; _c++) {
                var sym = _d[_c];
                $("input[symptomid='" + sym.symptomid + "']").prop("checked", true);
            }
        }
    };
    IssueSymptoms.prototype.Next = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.symptom = [];
        $("input[type='checkbox']:checked").each(function (i, e) {
            issue.symptom.push({
                symptomid: $(e).attr("symptomid")
            });
        });
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuesymptoms");
    };
    IssueSymptoms.prototype.Prev = function () {
        BasePage.NavigateTo("issuesexyears");
    };
    ;
    return IssueSymptoms;
}(BasePage));
//# sourceMappingURL=issuesymptoms.js.map
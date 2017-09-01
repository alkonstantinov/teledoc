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
var IssueAllergies = (function (_super) {
    __extends(IssueAllergies, _super);
    function IssueAllergies() {
        return _super.call(this) || this;
    }
    IssueAllergies.prototype.LoadFromIssue = function () {
        this.placeHolderText = Comm.POST("/translatestring", { word: "enterallergy" }).Translate;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.allergy != null) {
            for (var _i = 0, _a = issue.allergy; _i < _a.length; _i++) {
                var al = _a[_i];
                $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='" + al.allergy + "' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
            }
        }
        this.Add();
    };
    IssueAllergies.prototype.Add = function () {
        $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
    };
    IssueAllergies.prototype.Save = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var filled = $("input[type='text']").filter(function () { return this.value.length > 0; });
        if (filled.length == 0) {
            issue.allergy = [];
        }
        else {
            issue.allergy = [];
            for (var _i = 0, filled_1 = filled; _i < filled_1.length; _i++) {
                var item = filled_1[_i];
                issue.allergy.push({ allergy: $(item).val() });
            }
        }
        BasePage.SaveIssue(issue);
    };
    IssueAllergies.prototype.Next = function () {
        this.Save();
        BasePage.NavigateTo("issuemedicines");
    };
    IssueAllergies.prototype.Prev = function () {
        this.Save();
        BasePage.NavigateTo("issuechronics");
    };
    ;
    return IssueAllergies;
}(BasePage));
//# sourceMappingURL=issueallergies.js.map
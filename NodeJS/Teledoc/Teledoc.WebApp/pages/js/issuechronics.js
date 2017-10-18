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
var IssueChronics = (function (_super) {
    __extends(IssueChronics, _super);
    function IssueChronics() {
        return _super.call(this) || this;
    }
    IssueChronics.prototype.LoadFromIssue = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        this.placeHolderText = Comm.POST("/translatestring", { word: "enterchronic" }).Translate;
        var chronics = Comm.POST("/getchronics", {});
        for (var _i = 0, chronics_1 = chronics; _i < chronics_1.length; _i++) {
            var c = chronics_1[_i];
            if (c.chronicid > -1)
                $("#dChronic").append("<div class='row'><div class='col-md-12'><div class='form-check form-check-inline'><label class='form-check-label'><input type='checkbox' class='form-check-input' chronicid='" + c.chronicid + "'> " + c.chronicname + "</label></div></div>");
            else
                $("#dChronic").append("<div class='row'><div class='col-md-12'>" + c.chronicname + "</div></div>");
        }
        if (issue.chronic != null) {
            for (var _a = 0, _b = issue.chronic; _a < _b.length; _a++) {
                var c = _b[_a];
                if (c.chronicid > -1)
                    $("input[chronicid='" + c.chronicid + "']").prop("checked", true);
                else
                    $("#dChronic").append("<div class='row'><div class='col-md-12'><input type='text' value='" + c.chronicfree + "' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
            }
        }
        this.Add();
    };
    IssueChronics.prototype.Add = function () {
        $("#dChronic").append("<div class='row'><div class='col-md-12'><input type='text' value='' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
    };
    IssueChronics.prototype.Save = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.chronic = [];
        $("input[type='checkbox']:checked").each(function (i, e) {
            issue.chronic.push({
                chronicid: $(e).attr("chronicid")
            });
        });
        $("input[type='text']").filter(function () { return this.value.length > 0; }).each(function (i, e) {
            issue.chronic.push({
                chronicid: -1,
                chronicfree: $(e).val()
            });
        });
        BasePage.SaveIssue(issue);
    };
    IssueChronics.prototype.Next = function () {
        this.Save();
        BasePage.NavigateTo("issueallergies");
    };
    IssueChronics.prototype.Prev = function () {
        this.Save();
        BasePage.NavigateTo("issuesince");
    };
    ;
    return IssueChronics;
}(BasePage));
//# sourceMappingURL=issuechronics.js.map
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
var IssueMedicines = (function (_super) {
    __extends(IssueMedicines, _super);
    function IssueMedicines() {
        var _this = _super.call(this) || this;
        _this.ddlOptions = "";
        return _this;
    }
    IssueMedicines.prototype.LoadFromIssue = function () {
        this.placeHolderText = Comm.POST("/translatestring", { word: "entermedication" }).Translate;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var sinces = Comm.GET("/getsinces");
        for (var _i = 0, sinces_1 = sinces; _i < sinces_1.length; _i++) {
            var since = sinces_1[_i];
            this.ddlOptions += "<option value='" + since.sinceid + "'>" + since.sincename + "</option>";
        }
        var ddlId = 1;
        if (issue.medication != null) {
            for (var _a = 0, _b = issue.medication; _a < _b.length; _a++) {
                var med = _b[_a];
                $("#dMedicine").append("<div class='row'><div class='col-md-8'><input type='text' value='" + med.medication + "' class='form-control' placeholder='" + this.placeHolderText + "'></div>" +
                    "<div class='col-md-4'><select class='form-control' id='ddl" + ddlId + "'>" + this.ddlOptions + "</select></div></div>");
                $("#ddl" + ddlId).val(med.sinceid);
                ddlId++;
            }
        }
        this.Add();
    };
    IssueMedicines.prototype.Add = function () {
        $("#dMedicine").append("<div class='row'><div class='col-md-8'><input type='text' value='' class='form-control' placeholder='" + this.placeHolderText + "'></div>" +
            "<div class='col-md-4'><select class='form-control'>" + this.ddlOptions + "</select></div></div>");
    };
    IssueMedicines.prototype.Save = function () {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var filled = $("input[type='text']").filter(function () { return this.value.length > 0; });
        if (filled.length == 0) {
            issue.medication = null;
        }
        else {
            issue.medication = [];
            for (var _i = 0, filled_1 = filled; _i < filled_1.length; _i++) {
                var item = filled_1[_i];
                issue.medication.push({
                    medication: $(item).val(),
                    sinceid: $(item).parent().parent().find("select").val()
                });
            }
        }
        BasePage.SaveIssue(issue);
    };
    IssueMedicines.prototype.Next = function () {
        this.Save();
        BasePage.NavigateTo("issueanswertype");
    };
    IssueMedicines.prototype.Prev = function () {
        this.Save();
        BasePage.NavigateTo("issueallergies");
    };
    ;
    return IssueMedicines;
}(BasePage));
//# sourceMappingURL=issuemedicines.js.map
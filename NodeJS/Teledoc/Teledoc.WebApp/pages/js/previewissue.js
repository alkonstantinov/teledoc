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
var PreviewIssue = (function (_super) {
    __extends(PreviewIssue, _super);
    function PreviewIssue() {
        return _super.call(this) || this;
    }
    PreviewIssue.prototype.ShowIssue = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var json = Comm.POST("/getissue", { issueId: parts[1] });
        if (json == null)
            return;
        if (json.issuestatusid == 2)
            $("#bTake").hide();
        $("#hAnswerTypeId").text(json.answertypeid);
        $("#lWhoName").text(json.whoname);
        $("#lAnswerType").text(json.answertypename + " " + (json.additionalinfo == null ? "" : json.additionalinfo));
        $("#lGenderName").text(json.gendername);
        $("#lBornOn").text(json.birthmonth + "/" + json.birthyear);
        $("#lDescription").text(json.description);
        $("#lSince").text(json.sincename);
        $("#ulSymptoms").empty();
        if (json.symptoms != null)
            for (var _i = 0, _a = json.symptoms; _i < _a.length; _i++) {
                var item = _a[_i];
                $("#ulSymptoms").append("<li>" + item.symptomname + "</li>");
            }
        $("#ulAllergies").empty();
        if (json.allergies != null)
            for (var _b = 0, _c = json.allergies; _b < _c.length; _b++) {
                var item = _c[_b];
                $("#ulAllergies").append("<li>" + item.allergy + "</li>");
            }
        $("#ulChronics").empty();
        if (json.chronics != null)
            for (var _d = 0, _e = json.chronics; _d < _e.length; _d++) {
                var item = _e[_d];
                $("#ulChronics").append("<li>" + (item.chronicid == -1 ? item.chronicfree : item.chronicname) + "</li>");
            }
        $("#tMedications tbody").empty();
        if (json.medications != null)
            for (var _f = 0, _g = json.medications; _f < _g.length; _f++) {
                var item = _g[_f];
                $("#tMedications tbody").append("<tr><td>" + item.medication + "</td><td>" + item.sincename + "</td></tr>");
            }
    };
    PreviewIssue.prototype.Take = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        Comm.POST("/takeissue", { issueId: parts[1] });
        if ($("#hAnswerTypeId").val() == "1") {
            var parts = parent.location.hash.split("|");
            if (parts.length < 2)
                return;
            parent.location.hash = "chat|" + parts[1];
        }
        else {
            parent.location.hash = "";
        }
        BasePage.LoadCurrentPage();
    };
    return PreviewIssue;
}(BasePage));
//# sourceMappingURL=previewissue.js.map
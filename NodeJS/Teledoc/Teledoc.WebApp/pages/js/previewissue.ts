declare var $: any;
declare var previewIssue: PreviewIssue;

class PreviewIssue extends BasePage {

    public ShowIssue() {
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
            for (var item of json.symptoms) {
                $("#ulSymptoms").append("<li>" + item.symptomname + "</li>");
            }
        $("#ulAllergies").empty();
        if (json.allergies != null)
            for (var item of json.allergies) {
                $("#ulAllergies").append("<li>" + item.allergy + "</li>");
            }
        $("#ulChronics").empty();
        if (json.chronics != null)
            for (var item of json.chronics) {
                $("#ulChronics").append("<li>" + (item.chronicid == -1 ? item.chronicfree : item.chronicname) + "</li>");
            }
        $("#tMedications tbody").empty();
        if (json.medications != null)
            for (var item of json.medications) {

                $("#tMedications tbody").append("<tr><td>" + item.medication + "</td><td>" + item.sincename + "</td></tr>");
            }

    }
    public Take() {
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
    }
    constructor() {

        super();

    }

}



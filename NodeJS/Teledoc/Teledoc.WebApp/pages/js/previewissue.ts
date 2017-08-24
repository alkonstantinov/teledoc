declare var $: any;
declare var previewIssue: PreviewIssue;

class PreviewIssue extends BasePage {

    public ShowIssue() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var json = Comm.POST("/getissue", { issueId: parts[1] });
        $("#lWhoName").text(json.whoname);

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
                
                $("#tMedications tbody").append("<tr><td>" + item.medication+"</td><td>"+item.sincename + "</td></tr>");
            }

    }
    public Take() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        Comm.POST("/takeissue", { issueId: parts[1] });
    }
    constructor() {

        super();

    }

}



declare var $: any;
declare var issueSymptoms: IssueSymptoms;

class IssueSymptoms extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        var symptoms = Comm.GET("/getsymptoms");
        for (var group of symptoms) {
            $("#dSymptoms").append("<div class='row'><div class='col-md-12'><div class='label-info'>" + group.Name + "</div></div></div>");
            for (var sym of group.Symptoms) {
                $("#dSymptoms").append("<div class='row'><div class='col-md-12'><div class='checkbox'><label><input type='checkbox' class='form-control' symptomid='" + sym.Id + "'>" + sym.Name + "</label></div></div>");
            }
        }

        if (issue.symptom != null)
        {
            for (var sym of issue.symptom)
                $("input[symptomid='" + sym.symptomid + "']").prop("checked", true);
        }
    }

    public Next() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.symptom = [];
        $("input[type='checkbox']:checked").each(function (i, e) {
            issue.symptom.push({
                symptomid: $(e).attr("symptomid")
            })    
        });

        
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuesymptoms");

    }

    public Prev() {
        BasePage.NavigateTo("issuesexyears");
    };

    constructor() {

        super();

    }

}



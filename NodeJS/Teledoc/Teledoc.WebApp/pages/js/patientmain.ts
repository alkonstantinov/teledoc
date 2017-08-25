declare var $: any;
declare var patientMain: PatientMain;

class PatientMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesnotclosed", {});
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {
            
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";
            if (issue.statusid == 2)
                row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick=''></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }

    }

    public NewIssue() {
        parent.location.hash = "issuetarget";
        BasePage.LoadCurrentPage();
    }
    constructor() {

        super();

    }

}



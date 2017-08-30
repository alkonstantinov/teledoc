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
            {
                switch (issue.answertypeid) {
                    case 1: row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='patientMain.OpenChat(" + issue.issueid + ")'></span>"; break;
                    case 2: row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>"; break;
                    case 3: row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>"; break;
                }
            }
            row += "</td></tr>";
            $("#tIssues").append(row);
        }

    }

    public NewIssue() {
        parent.location.hash = "issuetarget";
        BasePage.LoadCurrentPage();
    }

    public OpenChat(issueId) {
        parent.location.hash = "chat|" + issueId;
        BasePage.LoadCurrentPage();
    }
    constructor() {

        super();

    }

}



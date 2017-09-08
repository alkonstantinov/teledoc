declare var $: any;
declare var patientMain: PatientMain;

class PatientMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesnotclosed", {});
        if (issues == null)
            return;

        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {
            alert(issue.answertypeid);
            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";
            if (issue.statusid == 2) {
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


    public LoadClosedIssues() {
        var issues = Comm.POST("/getclosedissues", {});

        $("#tClosedIssues").empty();
        if (issues == null)
            return;

        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>";

            switch (issue.answertypeid) {
                case 1: row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='patientMain.OpenChat(" + issue.issueid + ")'></span>" +
                    "<span class='glyphicon glyphicon-refresh pull-right' aria-hidden='true' onclick='patientMain.RestartChat(" + issue.issueid + ")'></span>"; break;
                case 2: row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>"; break;
                case 3: row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>"; break;
            }

            row += "</td></tr>";
            $("#tClosedIssues").append(row);
        }

    }

    public RestartChat(issueId) {
        Comm.POST("/restartchat", { issueId: issueId });
        BasePage.GotoPage("");
    }

    public NewIssue() {
        BasePage.GotoPage("issuetarget");

    }

    public OpenChat(issueId) {
        BasePage.GotoPage("chat|" + issueId);

    }
    constructor() {

        super();

    }

}



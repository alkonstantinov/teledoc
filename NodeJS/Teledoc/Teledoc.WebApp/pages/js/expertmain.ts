declare var $: any;
declare var expertMain: ExpertMain;

class ExpertMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesbyexpert", {});
        if (issues == null)
            return;
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>";

            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }

    }

    public LoadTakenIssues() {
        var issues = Comm.POST("/gettakenissues", {});
        $("#tTakenIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";

            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td><td>";
            switch (issue.answertypeid) {
                case 1: row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='expertMain.OpenChat(" + issue.issueid + ")'></span>"; break;
                case 2: row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>"; break;
                case 3: row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>"; break;
            }
            row += "</td><td><span class='glyphicon glyphicon-ok pull-right' aria-hidden='true' onclick='expertMain.CaseClosed(" + issue.issueid + ")'></span></td></tr>";
            $("#tTakenIssues").append(row);
        }

    }


    public LoadClosedIssues() {
        var issues = Comm.POST("/getclosedissues", {});

        $("#tClosedIssues").empty();
        if (issues == null)
            return;

        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>";
            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";

            switch (issue.answertypeid) {
                case 1: row += "<span class='glyphicon glyphicon-align-right pull-right' aria-hidden='true' onclick='expertMain.OpenChat(" + issue.issueid + ")'></span>" +
                    "<span class='glyphicon glyphicon-refresh pull-right' aria-hidden='true' onclick='expertMain.RestartChat(" + issue.issueid + ")'></span>"; break;
                case 2: row += "<span class='glyphicon glyphicon-envelope pull-right' aria-hidden='true'></span>"; break;
                case 3: row += "<span class='glyphicon glyphicon-earphone pull-right' aria-hidden='true'></span>"; break;
            }

            row += "</td></tr>";
            $("#tClosedIssues").append(row);
        }

    }

    public CaseClosed(issueId) {
        Comm.POST("/caseclosed", { issueId: issueId });
        BasePage.GotoPage("");
    }


    public RestartChat(issueId) {
        Comm.POST("/restartchat", { issueId: issueId });
        BasePage.GotoPage("");
    }

    public OpenChat(issueId) {
        BasePage.GotoPage("chat|" + issueId);        
    }

    public Preview(issueId) {
        BasePage.GotoPage("previewissue|" + issueId);
        
    }


    constructor() {

        super();

    }

}



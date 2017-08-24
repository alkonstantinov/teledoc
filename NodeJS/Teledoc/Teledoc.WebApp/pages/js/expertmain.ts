declare var $: any;
declare var expertMain: ExpertMain;

class ExpertMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesbyexpert", {});
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";

            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick='expertMain.Preview(" + issue.issueid + ")'></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }

    }


    public Preview(issueId) {
        parent.location.hash = "previewissue|" + issueId;
        BasePage.LoadCurrentPage();
    }


    constructor() {

        super();

    }

}



declare var $: any;
declare var expertMain: ExpertMain;

class ExpertMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesnotclosed", {});
        $("#tIssues").empty();
        if (issues == null)
            return;
        for (var issue of issues) {

            var row = "<tr><td>" + BasePage.PostgreTimestamp(issue.ondate) + "</td><td>" + issue.description + "</td><td>" + issue.statusname + "</td><td>";

            row += "<span class='glyphicon glyphicon-search pull-right' aria-hidden='true' onclick=''></span>";
            row += "</td></tr>";
            $("#tIssues").append(row);
        }

    }


    constructor() {

        super();

    }

}



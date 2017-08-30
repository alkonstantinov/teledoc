﻿declare var $: any;
declare var expertMain: ExpertMain;

class ExpertMain extends BasePage {

    public LoadPendingIssues() {
        var issues = Comm.POST("/getissuesbyexpert", {});
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
    public CaseClosed(issueId) {
        Comm.POST("/caseclosed", { issueId: issueId });
        parent.location.hash = "";
        BasePage.LoadCurrentPage();
    }

    public OpenChat(issueId) {
        parent.location.hash = "chat|" + issueId;
        BasePage.LoadCurrentPage();
    }

    public Preview(issueId) {
        parent.location.hash = "previewissue|" + issueId;
        BasePage.LoadCurrentPage();
    }


    constructor() {

        super();

    }

}



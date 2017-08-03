declare var $: any;
declare var issueChronics: IssueChronics;

class IssueChronics extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        var chronics = Comm.GET("/getchronics");
        for (var c of chronics) {
            if (c.chronicid > -1)
                $("#dChronic").append("<div class='row'><div class='col-md-12'><div class='checkbox'><label><input type='checkbox' class='form-control' chronicid='" + c.chronicid + "'>" + c.chronicname + "</label></div></div>");
            else
                $("#dChronic").append("<div class='row'><div class='col-md-12'>" + c.chronicname + "</div></div>");
        }
        
        if (issue.chronic != null) {
            for (var c of issue.chronic)
                if (c.chronicid > -1)
                    $("input[chronicid='" + c.chronicid + "']").prop("checked", true);
                else
                    $("#dChronic").append("<div class='row'><div class='col-md-12'><input type='text' value='" + c.chronicfree + "' placeholder='#enterchronic#' class='form-control'></div></div>");
        }
        this.Add();
    }

    public Add() {
        $("#dChronic").append("<div class='row'><div class='col-md-12'><input type='text' value='' placeholder='#enterchronic#' class='form-control'></div></div>");
    }

    public Next() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        issue.chronic = [];
        $("input[type='checkbox']:checked").each(function (i, e) {
            issue.chronic.push({
                chronicid: $(e).attr("chronicid")
            })
        });

        $("input[type='text']").filter(function () { return this.value.length > 0 }).each(function (i, e) {
            alert($(e).val());
            issue.chronic.push({
                chronicid: -1,
                chronicfree: $(e).val()
            })
        });

        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issueallergies");

    }

    public Prev() {
        BasePage.NavigateTo("issuesymptoms");
    };

    constructor() {

        super();

    }

}



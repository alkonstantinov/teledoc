declare var $: any;
declare var issueSince: IssueSince;

class IssueSince extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        var sinces = Comm.GET("/getsinces");
        for (var since of sinces) {
            $("#dSince").append("<div class='row'><div class='col-md-12'><div class='radio'><label><input type='radio' class='form-control' name='since' sinceid='" + since.sinceid + "'>" + since.sincename + "</label></div></div>");
        }
        $("input[type='radio']").first().prop("checked", true);

        if (issue.sinceid != null) {
            $("input[sinceid='" + issue.sinceid + "']").prop("checked", true);
        }
    }

    public Next() {
        

        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        issue.sinceid = $("input[type='radio']:checked").attr("sinceid");
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuechronics");

    }

    public Prev() {
        BasePage.NavigateTo("issuesymptoms");
    };

    constructor() {

        super();

    }

}



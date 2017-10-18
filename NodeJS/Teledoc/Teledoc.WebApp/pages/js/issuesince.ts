declare var $: any;
declare var issueSince: IssueSince;

class IssueSince extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        var sinces = Comm.POST("/getsinces", {});
        if (sinces == null)
            return;
        for (var since of sinces) {
            $("#dSince").append("<div class='row'><div class='col-md-12'><div class='form-check form-check-inline'><label class='form-check-label'><input type='radio' class='form-check-input' name='since' sinceid='" + since.sinceid + "'> " + since.sincename + "</label></div></div>");
        }
        $("input[type='radio']").first().prop("checked", true);

        if (issue.sinceid != null) {
            $("input[sinceid='" + issue.sinceid + "']").prop("checked", true);
        }
    }

    public Save() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        issue.sinceid = $("input[type='radio']:checked").attr("sinceid");
        BasePage.SaveIssue(issue);

    }
    public Next() {

        this.Save();
        BasePage.NavigateTo("issuechronics");

    }

    public Prev() {
        this.Save();
        BasePage.NavigateTo("issuesymptoms");
    };

    constructor() {

        super();

    }

}



declare var $: any;
declare var issueDescription: IssueDescription;

class IssueDescription extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.description != null) {
            $("#tbDesc").val(issue.description);
        }
    }

    public Save() {
        var error = false;
        BasePage.HideErrors();
        if ($("#tbDesc").val() == "") {
            error = true;
            $("#lErrtbDesc").show();
        }

        if (error)
            return false;


        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        issue.description = $("#tbDesc").val();

        BasePage.SaveIssue(issue);
        return true;
    }
    public Next() {
        if (this.Save())
            BasePage.NavigateTo("issuesexyears");

    }

    public Prev() {
        if (this.Save())
            BasePage.NavigateTo("issuetarget");
    };

    constructor() {

        super();

    }

}



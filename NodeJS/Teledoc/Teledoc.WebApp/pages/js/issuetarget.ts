declare var $: any;
declare var issuetarget: IssueTarget;

class IssueTarget extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            return;

        if (issue.whoid != null) {
            if (issue.whoid == 1)
                $("#rbMe").prop("checked", true);
            else
                $("#rbMyChild").prop("checked", true);
        }
        if (issue.reqexpertlevelid != null) {
            if (issue.reqexpertlevelid == 2)
                $("#rbDoctor").prop("checked", true);
            else
                $("#rbPharmacist").prop("checked", true);
        }
    }

    public Next() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        if ($("#rbMe").prop("checked"))
            issue.whoid = 1;
        else
            issue.whoid = 2;
        if ($("#rbDoctor").prop("checked"))
            issue.reqexpertlevelid = 2;
        else
            issue.reqexpertlevelid = 3;
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issuedescription");

    }

    constructor() {

        super();

    }

}



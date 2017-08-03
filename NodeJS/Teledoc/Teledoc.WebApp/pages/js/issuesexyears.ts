declare var $: any;
declare var issueSexYears: IssueSexYears;

class IssueSexYears extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.sexid != null) {
            switch (issue.sexid) {
                case "m": $("#rbMale").prop("checked", true); break;
                case "f": $("#rbFemale").prop("checked", true); break;
                case "b": $("#rbOther").prop("checked", true); break;
            }            
        }

        if (issue.birthmonth != null) {
            $("#ddlMonth").val(issue.birthmonth);
        }
        if (issue.birthyear != null) {
            $("#ddlYear").val(issue.birthyear);
        }
    }

    public Save()
    {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        if ($("#rbMale").prop("checked"))
            issue.sexid = "m";
        if ($("#rbFemale").prop("checked"))
            issue.sexid = "f";
        if ($("#rbOther").prop("checked"))
            issue.sexid = "b";
        issue.birthmonth = $("#ddlMonth").val();
        issue.birthyear = $("#ddlYear").val();


        BasePage.SaveIssue(issue);

    }
    public Next() {

        this.Save();

        BasePage.NavigateTo("issuesymptoms");

    }

    public Prev() {
        this.Save();
        BasePage.NavigateTo("issuedescription");
    };

    constructor() {

        super();

    }

}



declare var $: any;
declare var issueAnswerType: IssueAnswerType;

class IssueAnswerType extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if (issue.answertypeid != null) {
            switch (issue.answertypeid) {
                case 1: $("#rbChat").prop("checked", true); break;
                case 2: $("#rbeMail").prop("checked", true); $("#tbEmail").val(issue.additionalinfo); break;
                case 3: $("#rbCall").prop("checked", true); $("#tbPhone").val(issue.additionalinfo); break;
            }
        }
    }

    public Save() {
        var error = false;
        BasePage.HideErrors();
        if ($("#rbeMail").prop("checked") && !/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbEmail").val())) {
            error = true;
            $("#lErrtbEmail").show();
        }
        if ($("#rbCall").prop("checked") && $("#tbPhone").val() == "") {
            error = true;
            $("#lErrtbPhone").show();
        }

        if (error)
            return false;


        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        if ($("#rbeMail").prop("checked")) {

            issue.answertypeid = 2;
            issue.additionalinfo = $("#tbEmail").val();
        }
        if ($("#rbCall").prop("checked")) {

            issue.answertypeid = 3;
            issue.additionalinfo = $("#tbPhone").val();
        }
        if ($("#rbChat").prop("checked")) {

            issue.answertypeid = 1;
        }

        BasePage.SaveIssue(issue);
        return true;
    }

    public Next() {
        if (this.Save()) {
            var issue = BasePage.LoadIssue();
            Comm.POST("/setissue", { issue: JSON.stringify(issue) });
            BasePage.RemoveIssue();
            BasePage.GotoPage("patientmain");
        }
    }

    public Prev() {
        if (this.Save())
            BasePage.NavigateTo("issuemedicines");
    };

    constructor() {

        super();

    }

}



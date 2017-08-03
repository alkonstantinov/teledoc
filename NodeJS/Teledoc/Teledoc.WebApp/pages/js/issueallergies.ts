declare var $: any;
declare var issueAllergies: IssueAllergies;

class IssueAllergies extends BasePage {

    public LoadFromIssue() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        if (issue.allergy != null) {
            for (var al of issue.allergy)
                $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='" + al.allergy + "' class='form-control'></div></div>");
        }

        this.Add();
    }

    public Add() {
        $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='' placeholder='#enterallergy#' class='form-control'></div></div>");
    }

    public Next() {


        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var filled = $("input[type='text']").filter(function () { return this.value.length > 0 });
        if (filled.length == 0) {
            issue.allergy = null;
        }
        else {
            issue.allergy = [];
            for (var item of filled)
                issue.allergy.push({ allergy: $(item).val() });

        }
        BasePage.SaveIssue(issue);
        BasePage.NavigateTo("issueallergies");

    }

    public Prev() {
        BasePage.NavigateTo("issuechronics");
    };

    constructor() {

        super();

    }

}



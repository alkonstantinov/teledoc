declare var $: any;
declare var issueAllergies: IssueAllergies;

class IssueAllergies extends BasePage {
    private placeHolderText;

    public LoadFromIssue() {
        this.placeHolderText = Comm.POST("/translatestring", { word: "enterallergy" }).Translate;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        if (issue.allergy != null) {
            for (var al of issue.allergy)
                $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='" + al.allergy + "' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
        }

        this.Add();
    }

    public Add() {
        $("#dAllergy").append("<div class='row'><div class='col-md-12'><input type='text' value='' placeholder='" + this.placeHolderText + "' class='form-control'></div></div>");
    }

    public Save() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var filled = $("input[type='text']").filter(function () { return this.value.length > 0 });
        if (filled.length == 0) {
            issue.allergy = [];
        }
        else {
            issue.allergy = [];
            for (var item of filled)
                issue.allergy.push({ allergy: $(item).val() });

        }
        BasePage.SaveIssue(issue);

    }

    public Next() {


        this.Save();
        BasePage.NavigateTo("issuemedicines");

    }

    public Prev() {
        this.Save();
        BasePage.NavigateTo("issuechronics");
    };

    constructor() {

        super();

    }

}



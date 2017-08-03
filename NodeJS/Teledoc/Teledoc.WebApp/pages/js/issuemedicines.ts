declare var $: any;
declare var issueMedicines: IssueMedicines;

class IssueMedicines extends BasePage {

    ddlOptions: string = "";
    private placeHolderText;

    public LoadFromIssue() {
        this.placeHolderText = Comm.POST("/translatestring", { word: "entermedication" }).Translate;
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};

        var sinces = Comm.GET("/getsinces");
        for (var since of sinces) {
            this.ddlOptions += "<option value='" + since.sinceid + "'>" + since.sincename + "</option>";
        }

        var ddlId = 1;
        if (issue.medication != null) {
            for (var med of issue.medication) {

                $("#dMedicine").append("<div class='row'><div class='col-md-8'><input type='text' value='" + med.medication + "' class='form-control' placeholder='" + this.placeHolderText + "'></div>" +
                    "<div class='col-md-4'><select class='form-control' id='ddl" + ddlId + "'>" + this.ddlOptions + "</select></div></div>");
                $("#ddl" + ddlId).val(med.sinceid);
                ddlId++;

            }

        }

        this.Add();
    }

    public Add() {
        $("#dMedicine").append("<div class='row'><div class='col-md-8'><input type='text' value='' class='form-control' placeholder='" + this.placeHolderText + "'></div>" +
            "<div class='col-md-4'><select class='form-control'>" + this.ddlOptions + "</select></div></div>");
    }

    public Save() {
        var issue = BasePage.LoadIssue();
        if (issue == null)
            issue = {};
        var filled = $("input[type='text']").filter(function () { return this.value.length > 0 });
        if (filled.length == 0) {
            issue.medication = null;
        }
        else {
            issue.medication = [];
            for (var item of filled) {
                issue.medication.push({
                    medication: $(item).val(),
                    sinceid: $(item).parent().parent().find("select").val()
                });
            }
        }
        BasePage.SaveIssue(issue);

    }

    public Next() {

        this.Save();
        BasePage.NavigateTo("issuemedicines");

    }

    public Prev() {
        this.Save();
        BasePage.NavigateTo("issueallergies");
    };

    constructor() {

        super();

    }

}




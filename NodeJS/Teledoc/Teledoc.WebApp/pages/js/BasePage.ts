
declare var $: any;

class BasePage {
    static LastErrorA: String;
    static LastErrorB: String;
    static LastErrorC: String;
    static Issue: any;

    static ApplyNumbersOnly() {
        $(".numbersonly").keyup(
            function (e) {
                this.value = this.value.replace(/[^0-9]/gi, '');
            });
        $(".numbersdotonly").keyup(
            function (e) {
                this.value = this.value.replace(/[^0-9\.,]/gi, '');
                this.value = this.value.replace(/,/gi, '.');
            });
    }




    public parseJsonDate(jsonDateString) {
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    }

    static LoadPage(fnm: string) {
        let d: Date = new Date();
        $("#dContent").load("app/pages/" + fnm + "?" + d.getUTCMilliseconds());
    }



    static Logout() {
        parent.location.hash = "";
        //!!!!!!!!!!! изпращане на сигнал за логаут
        var page = Comm.GET("/getloginpage");
        $("#dContent").html(page);
        BasePage.LoadCurrentPage();
    }

    static NavigateTo(hash) {
        parent.location.hash = hash;
        BasePage.LoadCurrentPage();
    }

    static LoadCurrentPage() {
        var level = Comm.GET("/getlevel");
        var page = null;
        if (level.LevelId === -1) {
            page = Comm.GET("/getloginpage");
        }
        else {
            if (parent.location.hash.search("issuetarget") > -1)
                page = Comm.GET("/getissuetargetpage");
            if (parent.location.hash.search("issuedescription") > -1)
                page = Comm.GET("/getissuedescriptionpage");
            if (parent.location.hash.search("issuesexyears") > -1) {                
                page = Comm.GET("/getissuesexyearspage");
            }
            if (parent.location.hash.search("issuesymptoms") > -1)
                page = Comm.GET("/getissuesymptomspage");
            if (parent.location.hash.search("issuesince") > -1)
            {
                page = Comm.GET("/getissuesincepage");
            }
            if (parent.location.hash.search("issueallergies") > -1) {
                page = Comm.GET("/getissueallergiespage");
            }
            if (parent.location.hash.search("issuechronics") > -1) {
                page = Comm.GET("/getissuechronicspage");
            }
            if (parent.location.hash.search("issuemedicines") > -1) {
                page = Comm.GET("/getissuemedicinespage");
            }

        }

        $("#dContent").html(page);
        window.scrollTo(0, 0);
    }



    static HideErrors() {
        $("div[id^='lErr']").hide();
    }

    static SaveIssue(issue: any) {
        localStorage.setItem("Issue", JSON.stringify(issue));
    }

    static LoadIssue(): any {
        var issueText = localStorage.getItem("Issue");
        if (issueText == null)
            return null;
        else
            return JSON.parse(issueText);
    }

}

declare var $: any;

class BasePage {
    static LastErrorA: String;
    static LastErrorB: String;
    static LastErrorC: String;
    static Issue: any;
    protected pageSize = 2;
    static ShapeImage(img, maxSize) {
        var width = img.clientWidth;
        var height = img.clientHeight;
        var r = 1;
        if (width > height) {
            r = width / maxSize;

        }
        else {
            r = height / maxSize;
        }
        $(img).width(Math.round(width / r));
        $(img).height(Math.round(height / r));
    }

    static Guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


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

    static PostgreTimestamp(dt: any)
    {
        var date = new Date(dt);
        return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();  

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
        if (parent.location.hash.search("registeruser") > -1)
            page = Comm.GET("/getregisteruserpage");
        if (parent.location.hash.search("lostpass") > -1)
            page = Comm.GET("/getlostpasspage");
        else
            if (level.LevelId === -1) {
                page = Comm.GET("/getloginpage");
            }
            else {
                if (parent.location.hash == "") {
                    switch (level.LevelId) {
                        case 1: page = Comm.GET("/getdashboardpage"); break;
                        case 2: page = Comm.GET("/getexpertmain"); break;
                        case 3: page = Comm.GET("/getexpertmain"); break;

                        case 4: page = page = Comm.GET("/getissuetargetpage"); break;

                    }
                }
                if (parent.location.hash.search("loginpage") > -1)
                    page = Comm.GET("/getloginpage");
                if (parent.location.hash.search("issuetarget") > -1)
                    page = Comm.GET("/getissuetargetpage");
                if (parent.location.hash.search("issuedescription") > -1)
                    page = Comm.GET("/getissuedescriptionpage");
                if (parent.location.hash.search("issuesexyears") > -1) {
                    page = Comm.GET("/getissuesexyearspage");
                }
                if (parent.location.hash.search("issuesymptoms") > -1)
                    page = Comm.GET("/getissuesymptomspage");
                if (parent.location.hash.search("issuesince") > -1) {
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
                if (parent.location.hash.search("issueanswertype") > -1) {
                    page = Comm.GET("/getissueanswertypepage");
                }
                if (parent.location.hash.search("registerdoctor") > -1)
                    page = Comm.GET("/getregisterdoctorpage");
                if (parent.location.hash.search("userlist") > -1)
                    page = Comm.GET("/getuserlistpage");
                if (parent.location.hash.search("patientmain") > -1)
                    page = Comm.GET("/getpatientmain");
                if (parent.location.hash.search("expertmain") > -1)
                    page = Comm.GET("/getexpertmain");
                if (parent.location.hash.search("previewissue") > -1)
                    page = Comm.GET("/getpreviewissue");
                if (parent.location.hash.search("changepass") > -1)
                    page = Comm.GET("/getchangepasspage");
                if (parent.location.hash.search("dashboard") > -1)
                    page = Comm.GET("/getdashboardpage");
                if (parent.location.hash.search("chat") > -1)
                    page = Comm.GET("/getchatpage");
            }

        $("#dContent").html(page);
        window.scrollTo(0, 0);
        var menu = Comm.GET("/getmenu");
        $("#dMenu").html(menu);

        switch (level.LevelId) {
            case -1: $("#dMenu").hide(); break;
            case 1:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").show();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 2:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 3:
                $("#dMenu").show();
                $("#miNewIssue").hide();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
            case 4:
                $("#dMenu").show();
                $("#miNewIssue").show();
                $("#miUserList").hide();
                $("#miChangePass").show();
                $("#miLogoff").show();
                break;
        }
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

    static SaveLogin(loginResult: any) {
        localStorage.setItem("Login", JSON.stringify(loginResult));
    }

    static LoadLogin(): any {
        var loginResult = localStorage.getItem("Login");
        if (loginResult == null)
            return null;
        else
            return JSON.parse(loginResult);
    }

}
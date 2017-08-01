
declare var $: any;

class BasePage {
    static LastErrorA: String;
    static LastErrorB: String;
    static LastErrorC: String;

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

    static ShowMenuActive(liMiName: string) {
        $("li[id^='liMi']").removeAttr("class");
        $("#liMi" + liMiName).prop("class", "active");
    }

    static ShowMenu() {
        $("#nMenu").show();
    }

    static HideMenu() {
        $("#nMenu").hide();
    }

    static LoadLogged(): boolean {

        return localStorage.getItem("IsLogged") == "1";
    }

    static SetLogged(val: string) {
        localStorage.setItem("IsLogged", val);
    }

    static LoadUserLevel(): number {
        let result: string = localStorage.getItem("UserLevel");
        return (result == null ? -1 : parseInt(result));
    }

    static SetUserLevel(val: number) {
        localStorage.setItem("UserLevel", val.toString());
    }

    static Logout() {
        BasePage.LoadLogin();
    }



    static LoadInitial() {
        if (!BasePage.LoadLogged()) {
            this.LoadLogin();
        }
        else {
            if (parent.location.hash.search("universities") > -1)
                BasePage.LoadUniversities();
            else
                if (parent.location.hash.search("buildings") > -1)
                    BasePage.LoadBuildings();
                else
                    if (parent.location.hash.search("citystudents") > -1)
                        BasePage.LoadCityStudents();
                    else
                        if (parent.location.hash.search("examhalls") > -1)
                            BasePage.LoadExamHalls();
                        else
                            if (parent.location.hash.search("halls") > -1)
                                BasePage.LoadHalls();
                            else
                                if (parent.location.hash.search("users") > -1)
                                    BasePage.LoadUsers();
                                else
                                    if (parent.location.hash.search("students") > -1)
                                        BasePage.LoadStudents();
                                    else
                                        if (parent.location.hash.search("#student[\|]") > -1) {
                                            let params: string = parent.location.hash.replace("#student|", "");
                                            BasePage.LoadStudent(params);
                                        }
                                        else
                                            BasePage.LoadLogin();

        }
    }

    static LoadLogin() {
        BasePage.SetUserLevel(-1);
        BasePage.SetLogged("0")
        this.LoadPage("login.html");
        this.HideMenu();

    }

    static LoadUniversities() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("universities.html");
            this.ShowMenu();
            this.ShowMenuActive("Universities");
            parent.location.hash = "universities";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadExamHalls() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("examhalls.html");
            this.ShowMenu();
            this.ShowMenuActive("ExamHalls");
            parent.location.hash = "examhalls";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadHalls() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("halls.html");
            this.ShowMenu();
            this.ShowMenuActive("Halls");
            parent.location.hash = "halls";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadCityStudents() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("citystudents.html");
            this.ShowMenu();
            this.ShowMenuActive("CityStudents");
            parent.location.hash = "citystudents";
        }
        else
            BasePage.LoadLogin();
    }


    static LoadBuildings() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("buildings.html");
            this.ShowMenu();
            this.ShowMenuActive("Buildings");
            parent.location.hash = "buildings";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadUsers() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("users.html");
            this.ShowMenu();
            this.ShowMenuActive("Users");
            parent.location.hash = "users";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadError(a, b, c) {
        var myRegexp = /<h2>([\w\W]+)<\/h2>/g;
        var match = myRegexp.exec(a.responseText);
        BasePage.LastErrorA = match[1];
        BasePage.LastErrorB = b;
        BasePage.LastErrorC = c;
        this.LoadPage("error.html");
        this.ShowMenu();
        this.ShowMenuActive("error");
        parent.location.hash = "error";
    }

    static LoadStudents() {
        if (BasePage.LoadLogged()) {
            this.LoadPage("students.html");
            this.ShowMenu();
            this.ShowMenuActive("Students");
            parent.location.hash = "students";
        }
        else
            BasePage.LoadLogin();
    }

    static LoadStudent(params: String) {
        if (BasePage.LoadLogged()) {
            this.LoadPage("student.html");
            this.ShowMenu();
            this.ShowMenuActive("Students");
            parent.location.hash = "student|" + params;
        }
        else
            BasePage.LoadLogin();

    }


    static HideErrors() {
        $("div[id^='lErr']").hide();
    }


    static ValidEGN(s: String) {
        var t = [2, 4, 8, 5, 10, 9, 7, 3, 6];
        //if (typeof s != 'string') return false;
        if (s.length != 10)
            return false;
        var rv; var rr = 0;
        for (var i = 0; i < 9; i++) {
            if (s[i] == '0')
                continue;
            rr = rr + (parseInt(s[i]) * t[i]);
        }
        var chs = 0;
        chs = (rr % 11);
        if (chs == 10) chs = 0;
        if (parseInt(s[9]) == chs)
            return true;
        else
            return false;
    }

}
var BasePage = (function () {
    function BasePage() {
    }
    BasePage.ApplyNumbersOnly = function () {
        $(".numbersonly").keyup(function (e) {
            this.value = this.value.replace(/[^0-9]/gi, '');
        });
        $(".numbersdotonly").keyup(function (e) {
            this.value = this.value.replace(/[^0-9\.,]/gi, '');
            this.value = this.value.replace(/,/gi, '.');
        });
    };
    BasePage.prototype.parseJsonDate = function (jsonDateString) {
        return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    };
    BasePage.LoadPage = function (fnm) {
        var d = new Date();
        $("#dContent").load("app/pages/" + fnm + "?" + d.getUTCMilliseconds());
    };
    BasePage.ShowMenuActive = function (liMiName) {
        $("li[id^='liMi']").removeAttr("class");
        $("#liMi" + liMiName).prop("class", "active");
    };
    BasePage.ShowMenu = function () {
        $("#nMenu").show();
    };
    BasePage.HideMenu = function () {
        $("#nMenu").hide();
    };
    BasePage.LoadLogged = function () {
        return localStorage.getItem("IsLogged") == "1";
    };
    BasePage.SetLogged = function (val) {
        localStorage.setItem("IsLogged", val);
    };
    BasePage.LoadUserLevel = function () {
        var result = localStorage.getItem("UserLevel");
        return (result == null ? -1 : parseInt(result));
    };
    BasePage.SetUserLevel = function (val) {
        localStorage.setItem("UserLevel", val.toString());
    };
    BasePage.Logout = function () {
        BasePage.LoadLogin();
    };
    BasePage.LoadInitial = function () {
        if (!BasePage.LoadLogged()) {
            this.LoadLogin();
        }
        else {
            if (parent.location.hash.search("universities") > -1)
                BasePage.LoadUniversities();
            else if (parent.location.hash.search("buildings") > -1)
                BasePage.LoadBuildings();
            else if (parent.location.hash.search("citystudents") > -1)
                BasePage.LoadCityStudents();
            else if (parent.location.hash.search("examhalls") > -1)
                BasePage.LoadExamHalls();
            else if (parent.location.hash.search("halls") > -1)
                BasePage.LoadHalls();
            else if (parent.location.hash.search("users") > -1)
                BasePage.LoadUsers();
            else if (parent.location.hash.search("students") > -1)
                BasePage.LoadStudents();
            else if (parent.location.hash.search("#student[\|]") > -1) {
                var params = parent.location.hash.replace("#student|", "");
                BasePage.LoadStudent(params);
            }
            else
                BasePage.LoadLogin();
        }
    };
    BasePage.LoadLogin = function () {
        BasePage.SetUserLevel(-1);
        BasePage.SetLogged("0");
        this.LoadPage("login.html");
        this.HideMenu();
    };
    BasePage.LoadUniversities = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("universities.html");
            this.ShowMenu();
            this.ShowMenuActive("Universities");
            parent.location.hash = "universities";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadExamHalls = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("examhalls.html");
            this.ShowMenu();
            this.ShowMenuActive("ExamHalls");
            parent.location.hash = "examhalls";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadHalls = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("halls.html");
            this.ShowMenu();
            this.ShowMenuActive("Halls");
            parent.location.hash = "halls";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadCityStudents = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("citystudents.html");
            this.ShowMenu();
            this.ShowMenuActive("CityStudents");
            parent.location.hash = "citystudents";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadBuildings = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("buildings.html");
            this.ShowMenu();
            this.ShowMenuActive("Buildings");
            parent.location.hash = "buildings";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadUsers = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("users.html");
            this.ShowMenu();
            this.ShowMenuActive("Users");
            parent.location.hash = "users";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadError = function (a, b, c) {
        var myRegexp = /<h2>([\w\W]+)<\/h2>/g;
        var match = myRegexp.exec(a.responseText);
        BasePage.LastErrorA = match[1];
        BasePage.LastErrorB = b;
        BasePage.LastErrorC = c;
        this.LoadPage("error.html");
        this.ShowMenu();
        this.ShowMenuActive("error");
        parent.location.hash = "error";
    };
    BasePage.LoadStudents = function () {
        if (BasePage.LoadLogged()) {
            this.LoadPage("students.html");
            this.ShowMenu();
            this.ShowMenuActive("Students");
            parent.location.hash = "students";
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.LoadStudent = function (params) {
        if (BasePage.LoadLogged()) {
            this.LoadPage("student.html");
            this.ShowMenu();
            this.ShowMenuActive("Students");
            parent.location.hash = "student|" + params;
        }
        else
            BasePage.LoadLogin();
    };
    BasePage.HideErrors = function () {
        $("div[id^='lErr']").hide();
    };
    BasePage.ValidEGN = function (s) {
        var t = [2, 4, 8, 5, 10, 9, 7, 3, 6];
        //if (typeof s != 'string') return false;
        if (s.length != 10)
            return false;
        var rv;
        var rr = 0;
        for (var i = 0; i < 9; i++) {
            if (s[i] == '0')
                continue;
            rr = rr + (parseInt(s[i]) * t[i]);
        }
        var chs = 0;
        chs = (rr % 11);
        if (chs == 10)
            chs = 0;
        if (parseInt(s[9]) == chs)
            return true;
        else
            return false;
    };
    return BasePage;
}());
//# sourceMappingURL=basepage.js.map
declare var $: any;
declare var login: Login;

class Login extends BasePage {

    public DoLogin() {
        BasePage.HideErrors();
        let result = Comm.POST("/login", {
            Username: $("#tbUsername").val(),
            Password: $("#tbPassword").val()
        });
        switch (result.LevelId) {
            case -1:
                $("#lErrUser").show(); break;
            case 1:
                parent.location.hash = "dashboard";
                BasePage.LoadCurrentPage();
                break;
            case 2:
                parent.location.hash = "expertmain";
                BasePage.LoadCurrentPage();
                break;
            case 3: parent.location.hash = "expertmain";
                BasePage.LoadCurrentPage();
                break;
            case 4:
                parent.location.hash = "patientmain";
                BasePage.LoadCurrentPage();
                break;
        }
    }

    constructor() {

        super();
    }

}



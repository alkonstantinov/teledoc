declare var $: any;
declare var login: Login;

class Login extends BasePage {

    public DoLogin() {
        BasePage.HideErrors();
        let result = Comm.POST("/login", {
            Username: $("#tbUsername").val(),
            Password: $("#tbPassword").val()
        });
        BasePage.SaveLogin(result);
        BasePage.Socket.emit("iam", result.UserId);
        switch (result.LevelId) {
            case -1:
                $("#lErrUser").show(); break;
            case 1:
                BasePage.GotoPage("dashboard");
                break;
            case 2:
                BasePage.GotoPage("expertmain");
                break;
            case 3:
                BasePage.GotoPage("expertmain");
                break;
            case 4:
                BasePage.GotoPage("patientmain");
                break;
        }
    }

    constructor() {

        super();
    }

}



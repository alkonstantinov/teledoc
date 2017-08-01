declare var $: any;
declare var login: Login;

class Login extends BasePage {
    
    public DoLogin() {
        BasePage.HideErrors();
        let result = Comm.POST("/login",{
            Username: $("#tbUsername").val(),
            Password: $("#tbPassword").val()
        });
        switch (result.LevelId)
        {
            case -1:
                $("#lErrUser").show(); break;
            case 1:
                alert(1); break;
            case 2:
                alert(2); break;
            case 3:
                alert(3); break;
            case 4:
                alert(4); break;
        }
    }

    constructor() {
        
        super();
    }

}



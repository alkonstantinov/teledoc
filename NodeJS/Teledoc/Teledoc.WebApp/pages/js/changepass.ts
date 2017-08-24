declare var $: any;
declare var changePass: ChangePass;

class ChangePass extends BasePage {

    
    public Save() {
        var error = false;
        BasePage.HideErrors();
        if ($("#tbPass").val() == "") {
            error = true;
            $("#lErrtbPass").show();
        }

        if (error)
            return false;


        Comm.POST("changepass", { password: $("#tbPass").val()})
        return true;
    }
    
    constructor() {

        super();

    }

}



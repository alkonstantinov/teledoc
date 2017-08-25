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


        Comm.POST("changepass", { password: $("#tbPass").val() })
        $("#lSuccess").fadeIn(1000);
        $("#lSuccess").fadeOut(2000);
        return true;
    }
    
    constructor() {

        super();

    }

}



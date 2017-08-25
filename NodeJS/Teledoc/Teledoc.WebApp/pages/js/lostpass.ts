declare var $: any;
declare var lostPass: LostPass;

class LostPass extends BasePage {

    
    public Save() {
        var error = false;
        BasePage.HideErrors();
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbUsername").val())) {         
            error = true;
            $("#lErrtbUsername").show();
        }

        if (error)
            return false;


        Comm.POST("lostpassrenew", { email: $("#tbUsername").val() });
        $("#lSuccess").fadeIn(1000);
        $("#lSuccess").fadeOut(2000);

        return true;
    }
    
    constructor() {

        super();

    }

}



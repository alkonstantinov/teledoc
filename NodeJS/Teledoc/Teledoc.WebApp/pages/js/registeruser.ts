﻿declare var $: any;
declare var registerUser: RegisterUser;

class RegisterUser extends BasePage {

    public Register() {
        BasePage.HideErrors();
        var error = false;
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbRegEmail").val())) {
            error = true;
            $("#lErrtbRegEmail").show();
        }
        if ($("#tbRegEmail").val() != "" &&
            Comm.POST("/userexists", { email: $("#tbRegEmail").val()}).Exists
            ) {
            error = true;
            $("#lErrExists").show();
        }
        if ($("#tbRegPassword").val() == "") {
            error = true;
            $("#lErrtbRegPassword").show();
        }
        if (!$("#cbTermsAndConditions").prop("checked")) {
            error = true;
            $("#lErrTAC").show();
        }

        if (error)
            return;
        Comm.POST("/registeruser", {
            email: $("#tbRegEmail").val(),
            password: $("#tbRegPassword").val(),
            name: $("#tbName").val()
        });
        $("#dOK").show();

    }

    public Showtac() {
        $("#modalTAC").modal("show");
    }


    constructor() {

        super();

    }

}



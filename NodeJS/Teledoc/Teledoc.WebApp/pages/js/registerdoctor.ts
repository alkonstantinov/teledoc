declare var $: any;
declare var registerDoctor: RegisterDoctor;

class RegisterDoctor extends BasePage {

    public Register() {
        BasePage.HideErrors();
        var error = false;
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbRegEmail").val())) {
            error = true;
            $("#lErrtbRegEmail").show();
        }
        if ($("#tbRegEmail").val() != "" && $("#hUserId").val() != ""&&
            Comm.POST("/userexists", { email: $("#tbRegEmail").val() }).Exists
        ) {
            error = true;
            $("#lErrExists").show();
        }
        if ($("#tbRegPassword").val() == "") {
            error = true;
            $("#lErrtbRegPassword").show();
        }
        if ($("#tbUIN").val() == "") {
            error = true;
            $("#lErrtbUIN").show();
        }
        if (error)
            return;
        var json = {
            UserId: ($("#hUserId").val() == "" ? null : $("#hUserId").val()),
            UserName: $("#tbRegEmail").val(),
            Password: $("#tbRegPassword").val(),
            IsFB: false,
            Active: true,
            LevelId: $("#ddlLevelId").val(),
            Name: $("#tbName").val(),
            UIN: $("#tbUIN").val(),
            Fnm: $("#hFnm").val(),
            Specialization: $("#taSpecialization").val(),
            Description: $("#taDescription").val()

        };
        Comm.POST("/registerdoctor", { json: JSON.stringify(json) });
        $("#dOK").show();

    }
    public UploadImage() {
        var imageId = Comm.POSTImage("/uploadimage", "fImg");
        $("#hFnm").val(imageId);
        $("#iImg").prop("src", "/gettempimage?fnm=" + imageId);
        
    }

    constructor() {

        super();

    }

}



declare var $: any;
declare var registerDoctor: RegisterDoctor;

class RegisterDoctor extends BasePage {

    public Register() {
        BasePage.HideErrors();
        var error = false;

        var isNew = ($("#hUserId").val() == "");
        if (isNew&&! /^\w + ([\.-]?\ w +)*@\w + ([\.-]?\ w +)*(\.\w{2, 3 })+$ /.test($("#tbRegEmail").val())) {
            error = true;
            $("#lErrtbRegEmail").show();
        }
        if (isNew &&$("#tbRegEmail").val() != "" && $("#hUserId").val() != "" &&
            Comm.POST("/userexists", { email: $("#tbRegEmail").val() }).Exists
        ) {
            error = true;
            $("#lErrExists").show();
        }
        if (isNew &&$("#tbRegPassword").val() == "") {
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
        if (imageId == null)
            return;

        $("#hFnm").val(imageId);
        $("#iImg").prop("src", "/gettempimage?fnm=" + imageId);

    }

    public ShowDoctor() {

        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var json = Comm.POST("/getdoctor", { UserId: parts[1] });
        if (json == null)
            return;

        $("#hUserId").val(parts[1]);
        $("#tbRegEmail").val(json.username);
        $("#tbRegEmail").prop("disabled", true);
        $("#tbRegPassword").prop("disabled", true);
        $("#ddlLevelId").val(json.levelid);
        $("#tbName").val(json.name);
        $("#tbUIN").val(json.uin);
        $("#taSpecialization").val(json.specialization);
        $("#taDescription").val(json.description);
        $("#iImg").prop("src", "/getdoctorimage?UserId=" + parts[1]);

    }

    constructor() {

        super();

    }

}



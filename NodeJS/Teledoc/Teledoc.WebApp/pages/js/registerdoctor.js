var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RegisterDoctor = (function (_super) {
    __extends(RegisterDoctor, _super);
    function RegisterDoctor() {
        return _super.call(this) || this;
    }
    RegisterDoctor.prototype.Register = function () {
        BasePage.HideErrors();
        var error = false;
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbRegEmail").val())) {
            error = true;
            $("#lErrtbRegEmail").show();
        }
        if ($("#tbRegEmail").val() != "" && $("#hUserId").val() != "" &&
            Comm.POST("/userexists", { email: $("#tbRegEmail").val() }).Exists) {
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
    };
    RegisterDoctor.prototype.UploadImage = function () {
        var imageId = Comm.POSTImage("/uploadimage", "fImg");
        $("#hFnm").val(imageId);
        $("#iImg").prop("src", "/gettempimage?fnm=" + imageId);
    };
    return RegisterDoctor;
}(BasePage));
//# sourceMappingURL=registerdoctor.js.map
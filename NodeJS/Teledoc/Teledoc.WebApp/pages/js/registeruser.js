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
var RegisterUser = (function (_super) {
    __extends(RegisterUser, _super);
    function RegisterUser() {
        return _super.call(this) || this;
    }
    RegisterUser.prototype.Register = function () {
        BasePage.HideErrors();
        var error = false;
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbRegEmail").val())) {
            error = true;
            $("#lErrtbRegEmail").show();
        }
        if ($("#tbRegEmail").val() != "" &&
            Comm.POST("/userexists", { email: $("#tbRegEmail").val() }).Exists) {
            error = true;
            $("#lErrExists").show();
        }
        if ($("#tbRegPassword").val() == "") {
            error = true;
            $("#lErrtbRegPassword").show();
        }
        Comm.POST("/registeruser", {
            email: $("#tbRegEmail").val(),
            password: $("#tbRegPassword").val(),
            name: $("#tbName").val()
        });
        $("#dOK").show();
    };
    return RegisterUser;
}(BasePage));
//# sourceMappingURL=registeruser.js.map
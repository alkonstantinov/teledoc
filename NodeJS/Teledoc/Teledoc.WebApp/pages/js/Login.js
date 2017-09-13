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
var Login = (function (_super) {
    __extends(Login, _super);
    function Login() {
        return _super.call(this) || this;
    }
    Login.prototype.DoLogin = function () {
        BasePage.HideErrors();
        var result = Comm.POST("/login", {
            Username: $("#tbUsername").val(),
            Password: $("#tbPassword").val()
        });
        BasePage.SaveLogin(result);
        BasePage.Socket.emit("iam", result.UserId);
        switch (result.LevelId) {
            case -1:
                $("#lErrUser").show();
                break;
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
    };
    return Login;
}(BasePage));
//# sourceMappingURL=login.js.map
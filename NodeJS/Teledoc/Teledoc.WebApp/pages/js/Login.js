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
        switch (result.LevelId) {
            case -1:
                $("#lErrUser").show();
                break;
            case 1:
                alert(1);
                break;
            case 2:
                alert(2);
                break;
            case 3:
                alert(3);
                break;
            case 4:
                alert(4);
                break;
        }
    };
    return Login;
}(BasePage));
//# sourceMappingURL=Login.js.map
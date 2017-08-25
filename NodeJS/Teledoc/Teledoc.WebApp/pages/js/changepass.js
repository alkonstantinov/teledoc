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
var ChangePass = (function (_super) {
    __extends(ChangePass, _super);
    function ChangePass() {
        return _super.call(this) || this;
    }
    ChangePass.prototype.Save = function () {
        var error = false;
        BasePage.HideErrors();
        if ($("#tbPass").val() == "") {
            error = true;
            $("#lErrtbPass").show();
        }
        if (error)
            return false;
        Comm.POST("changepass", { password: $("#tbPass").val() });
        $("#lSuccess").fadeIn(1000);
        $("#lSuccess").fadeOut(2000);
        return true;
    };
    return ChangePass;
}(BasePage));
//# sourceMappingURL=changepass.js.map
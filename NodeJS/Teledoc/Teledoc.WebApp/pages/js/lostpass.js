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
var LostPass = (function (_super) {
    __extends(LostPass, _super);
    function LostPass() {
        return _super.call(this) || this;
    }
    LostPass.prototype.Save = function () {
        var error = false;
        BasePage.HideErrors();
        if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test($("#tbUsername").val())) {
            error = true;
            $("#lErrtbUsername").show();
        }
        if (error)
            return false;
        Comm.POST("lostpassrenew", { email: $("#tbUsername").val() });
        return true;
    };
    return LostPass;
}(BasePage));
//# sourceMappingURL=lostpass.js.map
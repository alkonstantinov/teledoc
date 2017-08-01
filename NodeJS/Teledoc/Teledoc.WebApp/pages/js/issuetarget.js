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
var IssueTarget = (function (_super) {
    __extends(IssueTarget, _super);
    function IssueTarget() {
        return _super.call(this) || this;
    }
    IssueTarget.prototype.Next = function () {
        if ($("#rbMe").prop("checked"))
            BasePage.Issue.WhoId = 1;
        else
            BasePage.Issue.WhoId = 2;
        if ($("#rbDoctor").prop("checked"))
            BasePage.Issue.ReqExpertLevelId = 2;
        else
            BasePage.Issue.ReqExpertLevelId = 3;
    };
    return IssueTarget;
}(BasePage));
//# sourceMappingURL=issuetarget.js.map
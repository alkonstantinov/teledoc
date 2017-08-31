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
var Dashboard = (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard() {
        return _super.call(this) || this;
    }
    Dashboard.prototype.LoadMeters = function () {
        var meters = Comm.POST("/dashboard", {});
        if (meters == null)
            return;
        $("#lregpatientscount").text(meters.regpatientscount);
        $("#lregdoctorscount").text(meters.regdoctorscount);
        $("#lregpharmacistscount").text(meters.regpharmacistscount);
        $("#lopenissuescount").text(meters.openissuescount);
        $("#ltakenissuescount").text(meters.takenissuescount);
        $("#lclosedissuesforweekcount").text(meters.closedissuesforweekcount);
    };
    return Dashboard;
}(BasePage));
//# sourceMappingURL=dashboard.js.map
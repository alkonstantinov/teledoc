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
var Chat = (function (_super) {
    __extends(Chat, _super);
    function Chat() {
        var _this = _super.call(this) || this;
        _this.socket = null;
        _this.loginResult = null;
        _this.loginResult = BasePage.LoadLogin();
        return _this;
    }
    Chat.prototype.Send = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var text = $("#tbMsg").val();
        this.socket.emit('send', { message: text, room: 'issue_' + issueId, userid: this.loginResult.UserId, name: this.loginResult.Name, issueId: issueId });
    };
    Chat.prototype.JoinRoom = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('room', 'issue_' + issueId);
    };
    Chat.prototype.AddMsg = function (data) {
        var msg = "<p align='right' style='font-size:12px'><b>" + data.ontime + "</b><br/>" + data.name + "</br>" + data.message + "</p>";
        var row = $("<div class='row' />");
        if (data.userid == this.loginResult.UserId) {
            $(row).append("<div class='col-md-6'/><div class='col-md-6' style='background-color: #d9edf7'>" + msg + "</div>");
        }
        else {
            $(row).append("<div class='col-md-6'>" + msg + "</div><div class='col-md-6'/>");
        }
        $("#dChat").append(row);
        var d = $('#dChat');
        d.scrollTop(d.prop("scrollHeight"));
    };
    Chat.prototype.LoadInitialChat = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var msgs = Comm.POST("/getchat", { issueId: issueId });
        for (var _i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
            var item = msgs_1[_i];
            this.AddMsg(item);
        }
    };
    return Chat;
}(BasePage));
//# sourceMappingURL=chat.js.map
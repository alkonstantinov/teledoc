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
        if ($("#tbMsg").val() == "" || $("#tbMsg").val() == null)
            return;
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
        var msg = "";
        if (!data.hasimg)
            msg = "<p align='right' style='font-size:12px'><b>" + data.ontime + "</b><br/>" + data.name + "</br>" + data.message + "</p>";
        else
            msg = "<p align='right' style='font-size:12px'><b>" + data.ontime + "</b><br/>" + data.name + "</p><img src='/getchatimage?ChatId=" + data.chatid + "' onload='BasePage.ShapeImage(this, 150);chat.ScrollDown();' onclick='chat.ShowLarge(" + data.chatid + ")'/>";
        var row = $("<div class='row' />");
        if (data.userid == this.loginResult.UserId) {
            $(row).append("<div class='col-md-6'/><div class='col-md-6' style='background-color: #d9edf7'>" + msg + "</div>");
        }
        else {
            $(row).append("<div class='col-md-6'>" + msg + "</div><div class='col-md-6'/>");
        }
        $("#dChat").append(row);
        this.ScrollDown();
    };
    Chat.prototype.ScrollDown = function () {
        var d = $('#dChat');
        d.scrollTop(d.prop("scrollHeight"));
    };
    Chat.prototype.LoadInitialChat = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var msgs = Comm.POST("/getchat", { issueId: issueId });
        if (msgs == null)
            return;
        for (var _i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
            var item = msgs_1[_i];
            this.AddMsg(item);
        }
    };
    Chat.prototype.ShowLarge = function (chatid) {
        $("#iLargeImg").prop("src", "getchatimage?ChatId=" + chatid);
        $("#modalLargeImage").modal("show");
    };
    Chat.prototype.CancelLargeImage = function () {
        $("#modalLargeImage").modal("hide");
    };
    Chat.prototype.UploadImage = function () {
        var imageId = Comm.POSTImage("/uploadimage", "fImg");
        if (imageId == null)
            return;
        $("#hFnm").val(imageId);
        $("#iImg").prop("src", "/gettempimage?fnm=" + imageId);
        $("#modalBrowseImage").modal("hide");
    };
    Chat.prototype.CancelImage = function () {
        $("#modalBrowseImage").modal("hide");
    };
    Chat.prototype.SendImageToChat = function () {
        if ($("#hFnm").val() == "" || $("#hFnm").val() == null)
            return;
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('sendimage', { room: 'issue_' + issueId, userid: this.loginResult.UserId, name: this.loginResult.Name, issueId: issueId, fnm: $("#hFnm").val() });
    };
    Chat.prototype.EndChat = function () {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('endchat', { room: 'issue_' + issueId, issueId: issueId });
    };
    Chat.prototype.ShowImageDialog = function () {
        $("#modalBrowseImage").modal("show");
    };
    return Chat;
}(BasePage));
//# sourceMappingURL=chat.js.map
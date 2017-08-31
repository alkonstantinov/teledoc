declare var $: any;
declare var chat: Chat;

class Chat extends BasePage {
    public socket = null;
    private loginResult = null;
    public Send() {
        if ($("#tbMsg").val() == "" || $("#tbMsg").val() == null)
            return;
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var text = $("#tbMsg").val();
        this.socket.emit('send', { message: text, room: 'issue_' + issueId, userid: this.loginResult.UserId, name: this.loginResult.Name, issueId: issueId });
    }

    public JoinRoom() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('room', 'issue_' + issueId);
    }

    public AddMsg(data) {

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
    }

    public ScrollDown() {
        var d = $('#dChat');
        d.scrollTop(d.prop("scrollHeight"));
    }
    public LoadInitialChat() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var msgs = Comm.POST("/getchat", { issueId: issueId });
        if (msgs == null)
            return;
        for (var item of msgs)
            this.AddMsg(item);

    }

    public ShowLarge(chatid) {
        $("#iLargeImg").prop("src", "getchatimage?ChatId=" + chatid);
        $("#modalLargeImage").modal("show");
    }

    public CancelLargeImage() {
        $("#modalLargeImage").modal("hide");
    }

    public UploadImage() {
        var imageId = Comm.POSTImage("/uploadimage", "fImg");
        if (imageId == null)
            return;
        $("#hFnm").val(imageId);
        $("#iImg").prop("src", "/gettempimage?fnm=" + imageId);
        $("#modalBrowseImage").modal("hide");

    }


    public CancelImage() {
        $("#modalBrowseImage").modal("hide");
    }

    public SendImageToChat() {
        if ($("#hFnm").val() == "" || $("#hFnm").val() == null)
            return;
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];

        this.socket.emit('sendimage', { room: 'issue_' + issueId, userid: this.loginResult.UserId, name: this.loginResult.Name, issueId: issueId, fnm: $("#hFnm").val() });
    }

    public EndChat() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('endchat', { room: 'issue_' + issueId, issueId: issueId });
    }

    public ShowImageDialog() {
        $("#modalBrowseImage").modal("show");
    }

    constructor() {

        super();
        this.loginResult = BasePage.LoadLogin();


    }

}



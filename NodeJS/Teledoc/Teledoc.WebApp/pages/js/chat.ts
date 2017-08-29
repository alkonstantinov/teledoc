declare var $: any;
declare var chat: Chat;

class Chat extends BasePage {
    public socket = null;
    private loginResult = null;
    public Send() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var text = $("#tbMsg").val();
        this.socket.emit('send', { message: text, room: 'issue_' + issueId, userid: this.loginResult.UserId, name: this.loginResult.Name, issueId: issueId});
    }

    public JoinRoom() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        this.socket.emit('room', 'issue_' + issueId);
    }

    public AddMsg(data) {
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
    }

    public LoadInitialChat() {
        var parts = parent.location.hash.split("|");
        if (parts.length < 2)
            return;
        var issueId = parts[1];
        var msgs = Comm.POST("/getchat", { issueId: issueId });
        for (var item of msgs)
            this.AddMsg(item);

    }

    constructor() {

        super();
        this.loginResult = BasePage.LoadLogin();


    }

}



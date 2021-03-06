var Comm = (function () {
    function Comm() {
    }
    Comm.ShowLoader = function () {
        $("#dLoader").show();
    };
    Comm.HideLoader = function () {
        $("#dLoader").hide();
    };
    Comm.GET = function (url) {
        var result;
        $.ajax({
            cache: false,
            url: url,
            method: "GET",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (res) {
                if (res.errorCode == -1) {
                    BasePage.GotoPage("loginpage");
                    return;
                }
                result = res;
            },
            error: function (a, b, c) {
            }
        });
        return result;
    };
    Comm.POST = function (url, data) {
        Comm.ShowLoader();
        var result;
        data.sessionId = localStorage.getItem("sessionId");
        $.ajax({
            cache: false,
            url: url,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(data),
            async: false,
            success: function (res) {
                Comm.HideLoader();
                if (res.errorCode == -1) {
                    BasePage.GotoPage("loginpage");
                    throw new Error("No access");
                }
                result = res;
            },
            error: function (a, b, c) {
                Comm.HideLoader();
                //BasePage.LoadError(a, b, c);
            }
        });
        //if (result == -1)
        //    BasePage.LoadLogin();        
        Comm.HideLoader();
        return result;
    };
    Comm.POSTImage = function (url, formId) {
        //$("#" + formId).submit();
        Comm.ShowLoader();
        var result;
        var formData = new FormData($("#" + formId)[0]);
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            beforeSend: function () {
            },
            success: function (data) {
                Comm.HideLoader();
                result = data.imageId;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                Comm.HideLoader();
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        Comm.HideLoader();
        return result;
    };
    return Comm;
}());
//# sourceMappingURL=comm.js.map
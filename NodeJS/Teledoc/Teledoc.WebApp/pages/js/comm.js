var Comm = (function () {
    function Comm() {
    }
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
                    parent.location.hash = "loginpage";
                    BasePage.LoadCurrentPage();
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
        var result;
        $.ajax({
            cache: false,
            url: url,
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(data),
            async: false,
            success: function (res) {
                if (res.errorCode == -1) {
                    parent.location.hash = "loginpage";
                    BasePage.LoadCurrentPage();
                    return;
                }
                result = res;
            },
            error: function (a, b, c) {
                //BasePage.LoadError(a, b, c);
            }
        });
        //if (result == -1)
        //    BasePage.LoadLogin();
        return result;
    };
    Comm.POSTImage = function (url, formId) {
        //$("#" + formId).submit();
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
                result = data.imageId;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        return result;
    };
    return Comm;
}());
//# sourceMappingURL=comm.js.map
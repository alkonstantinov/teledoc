declare var $: any;

class Comm {

    static GET(url: string): any {
        var result: any;
        $.ajax({
            cache: false,
            url: url,
            method: "GET",
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (res) {
                if (res.errorCode == -1)
                {                    
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
    }


    static POST(url: string, data: any): any {
        var result: any;

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
    }

    static POSTImage(url, formId): any {
        
        //$("#" + formId).submit();

        var result: any;

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
    }
}
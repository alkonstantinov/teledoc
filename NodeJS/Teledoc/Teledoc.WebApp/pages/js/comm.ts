﻿declare var $: any;

class Comm {

    static ShowLoader() {

        $("#dLoader").show();
    }

    static HideLoader() {

        $("#dLoader").hide();
    }

   

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
                    BasePage.GotoPage("loginpage");
                    
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
        Comm.ShowLoader();
        var result: any;
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
    }

    static POSTImage(url, formId): any {
        
        //$("#" + formId).submit();
        Comm.ShowLoader();
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
    }
}
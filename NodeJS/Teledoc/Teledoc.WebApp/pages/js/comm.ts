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

}
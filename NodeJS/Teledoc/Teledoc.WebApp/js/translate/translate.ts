var exports: any;
var trans: any = new Object();

exports.Translate = function (locale, key, fileSystem) {
    if (trans[locale] == undefined) {
        var txt: string = fileSystem.readFileSync("./js/translate/" + locale + ".json", "utf8");
        var txt2: string = txt.toString();
        var obj = JSON.parse(txt2);
        trans[locale] = obj;

    }
    return trans[locale][key];
};
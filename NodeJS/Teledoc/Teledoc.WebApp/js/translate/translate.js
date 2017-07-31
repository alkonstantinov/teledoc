var exports;
var trans = new Object();
exports.Translate = function (locale, key, fileSystem) {
    if (trans[locale] == undefined) {
        var txt = fileSystem.readFileSync("./js/translate/" + locale + ".json", "utf8");
        var txt2 = txt.toString();
        var obj = JSON.parse(txt2);
        trans[locale] = obj;
    }
    return trans[locale][key];
};
//# sourceMappingURL=translate.js.map
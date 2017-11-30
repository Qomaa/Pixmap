var dbg;
var map;
var saveButton;
var loadButton;
window.onload = function () {
    dbg = document.getElementById("debug");
    map = new Map();
    map.Load();
    //map = new Map(400, 400, 50, 50);
    //map.GenerateMapFields();
    saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function (e) {
        map.Save();
    });
    loadButton = document.getElementById("load");
    loadButton.addEventListener("click", function (e) {
        map.Load();
    });
};
function debug(text) {
    dbg.innerText = dbg.innerText + "\r" + text;
}
//# sourceMappingURL=public.js.map
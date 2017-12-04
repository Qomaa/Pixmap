var map;
var editDialog;
var RECEIVE_ADDRESS;
window.onload = function () {
    map = new Pixmap();
    map.load();
    //HOLEN AUS BLOB
    RECEIVE_ADDRESS = "QZZFKBIQNIBFNZBEU9DLGKHRMOWWGRDAYBKFAXSBWMDXEEAWIRUDDOVSEEFJ9ECH9VWJAFKLHSFAYUHJCEVZALQHQX";
    editDialog = document.getElementById("editDialog");
    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click", function (e) {
        map.save();
    });
};
window.onclick = function (event) {
    if (event.target == editDialog) {
        //Dialog schließen
        editDialog.style.display = "none";
    }
};
//# sourceMappingURL=public.js.map
var map;
var editDialog;
var RECEIVE_ADDRESS;
window.onload = function () {
    map = new Pixmap();
    map.load();
    editDialog = new EditDialog();
    map.divElement.addEventListener("mousedown", function (e) {
        //console.log(e);
        var id = e.target.id;
        var x = +id.substring(1, id.indexOf("y")); /* + heißt "als number" */
        var y = +id.substring(id.indexOf("y") + 1);
        editDialog.show(map.mapFields.filter(function (item) { return item.x == x && item.y == y; })[0]);
    });
    //HOLEN AUS BLOB
    RECEIVE_ADDRESS = "QZZFKBIQNIBFNZBEU9DLGKHRMOWWGRDAYBKFAXSBWMDXEEAWIRUDDOVSEEFJ9ECH9VWJAFKLHSFAYUHJCEVZALQHQX";
    // let saveButton = document.getElementById("save") as HTMLButtonElement;
    // saveButton.addEventListener("click", function(e){
    //     map.save();
    // });
};
window.onclick = function (event) {
    if (event.target == editDialog.dialogDiv) {
        editDialog.hide();
    }
};
//# sourceMappingURL=public.js.map
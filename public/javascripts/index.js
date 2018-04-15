let map;
let RECEIVE_ADDRESS;
let CLIENT_ID;
let editDialog;
let batchMode;
window.onload = function () {
    loadPixmap();
};
function loadPixmap() {
    let loading = document.getElementById("loading");
    loading.style.display = "block";
    editDialog = new EditDialog();
    map = new Pixmap();
    batchMode = new BatchMode(map);
    map.load(() => {
        map.generateMap();
        loading.style.display = "none";
    });
    // map.divElement.addEventListener("mouseenter", function (e) {
    //     if (e.button === 1 && batchMode.isEnabled) // linke Taste
    //     {
    //         if (!batchMode.isEnabled) return;
    //         let id = (e.target as HTMLDivElement).id;
    //         let x: string = id.substring(1, id.indexOf("y"));
    //         let y: string = id.substring(id.indexOf("y") + 1);
    //         let mapField = map.mapFields.filter(item => item.x == x && item.y == y)[0]
    //         batchMode.setField(mapField);
    //     }
    // });
    map.divElement.addEventListener("mousedown", function (e) {
        //if (batchMode.isEnabled) return;
        //console.log(e);
        let id = e.target.id;
        let x = id.substring(1, id.indexOf("y"));
        let y = id.substring(id.indexOf("y") + 1);
        let mapField = map.mapFields.filter(item => item.x == x && item.y == y)[0];
        if (mapField === undefined)
            return;
        if (batchMode.isEnabled)
            batchMode.setField(mapField);
        else
            editDialog.show(mapField);
    });
    batchMode.divElement.addEventListener("click", function (e) {
        if (!batchMode.isEnabled)
            batchMode.enable();
        else
            batchMode.disable();
    });
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/address", true);
    xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
            return;
        RECEIVE_ADDRESS = xhttp.responseText;
    };
    xhttp.send();
    let xhttp2 = new XMLHttpRequest();
    xhttp2.open("GET", "/getGuid", true);
    xhttp2.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    xhttp2.onreadystatechange = function () {
        if (xhttp2.readyState !== XMLHttpRequest.DONE || xhttp2.status !== 200)
            return;
        CLIENT_ID = xhttp2.responseText;
    };
    xhttp2.send();
    /* SAVE BUTTON AUCH SETZEN IN: index.pug, app.ts */
    // let saveButton = document.getElementById("save") as HTMLButtonElement;
    // saveButton.addEventListener("click", function(e){
    //     map.save();
    // });
}
window.onclick = function (event) {
    if (event.target == editDialog.dialogDiv) {
        editDialog.hide();
    }
};
document.onkeydown = function (event) {
    if (event.keyCode == 27) {
        // 27 = escape
        editDialog.hide();
    }
};
//# sourceMappingURL=index.js.map
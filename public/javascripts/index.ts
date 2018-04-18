let map: Pixmap;
let RECEIVE_ADDRESS: string;
let CLIENT_ID: string;
let editDialog: EditDialog;
let batchMode: BatchMode;

window.onload = function () {
    loadPixmap();
}

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

    map.divElement.addEventListener("mouseover", function (e: MouseEvent) {
        if (e.buttons != 1) return;
        let id = (e.target as HTMLDivElement).id
        setField(id);
    });

    map.divElement.addEventListener("mousedown", function (e: MouseEvent) {
        if (e.buttons != 1) return;
        let id = (e.target as HTMLDivElement).id
        setField(id);
    });

    batchMode.divElement.addEventListener("click", function (e: MouseEvent) {
        if (!batchMode.isEnabled)
            batchMode.enable();
        else
            batchMode.disable();
    });

    let xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("GET", "/address", true);
    xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
        RECEIVE_ADDRESS = xhttp.responseText;
    }
    xhttp.send();

    let xhttp2: XMLHttpRequest = new XMLHttpRequest();
    xhttp2.open("GET", "/getGuid", true);
    xhttp2.setRequestHeader("Content-Type", "text/html; charset=utf-8")
    xhttp2.onreadystatechange = function () {
        if (xhttp2.readyState !== XMLHttpRequest.DONE || xhttp2.status !== 200) return;
        CLIENT_ID = xhttp2.responseText;
    }
    xhttp2.send();
}

window.onclick = function (event) {
    if (event.target == editDialog.dialogDiv) {
        editDialog.hide();
    }
}

document.onkeydown = function (event) {
    if (event.keyCode == 27) {
        // 27 = escape
        editDialog.hide();
    }
}

function setField(id: string) {
    let x: string = id.substring(1, id.indexOf("y"));
    let y: string = id.substring(id.indexOf("y") + 1);
    let mapField = map.mapFields.filter(item => item.x == x && item.y == y)[0]

    if (mapField === undefined) return;

    if (batchMode.isEnabled)
        batchMode.setField(mapField);
    else
        editDialog.show(mapField);
}
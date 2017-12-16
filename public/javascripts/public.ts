let map: Pixmap;
let RECEIVE_ADDRESS: string;
let editDialog: EditDialog;

window.onload = function () {
    let loading = document.getElementById("loading");
    editDialog = new EditDialog();

    map = new Pixmap();
    map.load();

    loading.style.display = "none";

    map.divElement.addEventListener("mousedown", function (e: MouseEvent) {
        //console.log(e);
        let id = (e.target as HTMLDivElement).id;
        let x: number = +id.substring(1, id.indexOf("y")); /* + heißt "als number" */
        let y: number = +id.substring(id.indexOf("y") + 1);

        editDialog.show(map.mapFields.filter(item => item.x == x && item.y == y)[0]);
    });

    let xhttp: XMLHttpRequest = new XMLHttpRequest();
    xhttp.open("GET", "/address", true);
    xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
        RECEIVE_ADDRESS = xhttp.responseText;
    }
    xhttp.send();

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
}
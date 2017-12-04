let map: Pixmap;
let editDialog: HTMLDivElement;
let RECEIVE_ADDRESS: string;

window.onload = function () {
    map = new Pixmap();
    map.load();

    //HOLEN AUS BLOB
    RECEIVE_ADDRESS = "QZZFKBIQNIBFNZBEU9DLGKHRMOWWGRDAYBKFAXSBWMDXEEAWIRUDDOVSEEFJ9ECH9VWJAFKLHSFAYUHJCEVZALQHQX";

    editDialog = document.getElementById("editDialog") as HTMLDivElement;

    let saveButton = document.getElementById("save") as HTMLButtonElement;
    saveButton.addEventListener("click", function(e){
        map.save();
    });
}

window.onclick = function(event) {
    if (event.target == editDialog) {
        //Dialog schließen
        editDialog.style.display = "none";
    }
}
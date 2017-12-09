let map: Pixmap;
let editDialog: EditDialog; 
let RECEIVE_ADDRESS: string;

window.onload = function () {
    map = new Pixmap();
    map.load();
    
    editDialog = new EditDialog();    

    map.divElement.addEventListener("mousedown", function (e: MouseEvent) {
        //console.log(e);
        let id = (e.target as HTMLDivElement).id; 
        let x: number = +id.substring(1, id.indexOf("y")); /* + heißt "als number" */
        let y: number = +id.substring(id.indexOf("y") + 1);
        
        editDialog.show(map.mapFields.filter(item => item.x == x && item.y == y)[0]);
    });        

    //HOLEN AUS BLOB
    RECEIVE_ADDRESS = "QZZFKBIQNIBFNZBEU9DLGKHRMOWWGRDAYBKFAXSBWMDXEEAWIRUDDOVSEEFJ9ECH9VWJAFKLHSFAYUHJCEVZALQHQX";

    let saveButton = document.getElementById("save") as HTMLButtonElement;
    saveButton.addEventListener("click", function(e){
        map.save();
    });
}

window.onclick = function(event) {
    if (event.target == editDialog.dialogDiv) {
        editDialog.hide();
    }
}
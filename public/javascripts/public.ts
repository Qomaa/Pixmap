
let dbg: HTMLElement;
let map: Map;
let saveButton: HTMLButtonElement;
let loadButton: HTMLButtonElement;

window.onload = function () {
    dbg = document.getElementById("debug");

    map = new Map();
    map.Load();

    //map = new Map(400, 400, 50, 50);
    //map.GenerateMapFields();

    saveButton = document.getElementById("save") as HTMLButtonElement;
    saveButton.addEventListener("click", function (e: MouseEvent) {
        map.Save();
    });

    loadButton = document.getElementById("load") as HTMLButtonElement;
    loadButton.addEventListener("click", function (e: MouseEvent) {
        map.Load();
    });
}

function debug(text) {
    dbg.innerText = dbg.innerText + "\r" + text;
}


class Pixmap {
    constructor() {
        this.divElement = document.getElementById("pixmap");
        this.mapFields = new Array();
    }
    load(callback) {
        let m;
        let self = this;
        let body = document.querySelector("body");
        //From Server server holen
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/loadMap", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            m = JSON.parse(xhttp.responseText);
            //console.log(xhttp.responseText);
            self.width = m.width;
            self.height = m.height;
            self.fieldLength = m.fieldLength;
            self.rowCount = m.rowCount;
            self.columnCount = m.columnCount;
            self.mapFields = m.mapFields;
            callback();
            // self.generateMap();
            // self.convertToMongo();
        };
        xhttp.send();
    }
    convertToTrytes() {
        this.mapFields.forEach(function (mapField) {
            mapField.x = pad(numberToTrytes(+mapField.x), 2, "9");
            mapField.y = pad(numberToTrytes(+mapField.y), 2, "9");
        });
    }
    generateMap() {
        let self = this;
        let body = document.querySelector("body");
        while (this.divElement.firstChild) {
            this.divElement.removeChild(this.divElement.firstChild);
        }
        body.style.setProperty('--mapFieldLength', this.fieldLength + "px");
        body.style.setProperty("--pixmapWidth", this.width + "px");
        body.style.setProperty("--pixmapHeight", this.height + "px");
        this.mapFields.forEach(function (mapField) {
            mapField.getDivElement = MapField.prototype.getDivElement; //Die Funktion kommt nicht aus dem JSON-Objekt und muss manuell zugewiesen werden.
            mapField.pixmap = self;
            self.divElement.appendChild(mapField.getDivElement());
        });
    }
}
//# sourceMappingURL=Pixmap.js.map
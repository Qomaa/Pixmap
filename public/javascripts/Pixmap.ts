class Pixmap{
    constructor() { }

    save() {
        let mapString = JSON.stringify(this, function (key: string, value: any) {
            if (key === "divElement" || key === "pixmap") return undefined;
            return value;
        });

        let m = JSON.parse(mapString);

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/mapsave", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(mapString);
    }

    load() {
        let m: Pixmap;
        let self = this;

        //Initial
        // this.width = 600;
        // this.height = 600;

        // self.divElement.style.width = this.width + "px";
        // self.divElement.style.height = this.height + "px";
        // self.rowCount = 100;
        // self.columnCount = 100;
        // self.fieldWidth = this.width / self.rowCount;
        // self.fieldHeight = this.height / self.columnCount;
        // for (var x = 0; x < self.rowCount; x++) {
        //     for (var y = 0; y < self.columnCount; y++) {
        //         let mapField = new MapField(x, y,"#FFFFFF", 1, self);
        //         self.mapFields.push(mapField);
        //         self.divElement.appendChild(mapField.getDivElement());
        //     }
        // }

        //From Server server holen
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("GET", "/mapload", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.onreadystatechange = function () {
           if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;

           m = JSON.parse(xhttp.responseText);
           self.width = m.width;
           self.height = m.height;
           self.fieldWidth = m.fieldWidth;
           self.fieldHeight = m.fieldHeight;
           self.divElement.style.width = m.width + "px";
           self.divElement.style.height = m.height + "px";
           self.rowCount = m.rowCount;
           self.columnCount = m.columnCount;
           self.mapFields = m.mapFields;
           self.generateMap();
        }
        xhttp.send();
    }

    generateMap() {
        let self = this;

        while (this.divElement.firstChild) {
            this.divElement.removeChild(this.divElement.firstChild);
        }

        this.mapFields.forEach(function (mapField: MapField) {
            mapField.getDivElement = MapField.prototype.getDivElement; //Die Funktion kommt nicht aus dem JSON-Objekt und muss manuell zugewiesen werden.
            mapField.pixmap = self;
            self.divElement.appendChild(mapField.getDivElement());
        });
    }

    fieldHeight: number;
    fieldWidth: number;
    private divElement = document.getElementById("pixmap");
    private columnCount: number;
    private rowCount: number;
    private height: number;
    private width: number;
    private mapFields: MapField[] = new Array<MapField>();
}
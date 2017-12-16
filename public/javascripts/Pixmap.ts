class Pixmap {
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
        //console.log(mapString);
    }

    load() {
        let m: Pixmap;
        let self = this;
        let body = document.querySelector("body");

        // //Initial
        // this.width = 800;
        // this.height = 600;
        // this.fieldLength = 5;
        // body.style.setProperty("--pixmapWidth", this.width + "px");
        // body.style.setProperty("--pixmapHeight", this.height + "px");
        // body.style.setProperty('--mapFieldLength', this.fieldLength + "px");
        // this.rowCount = this.height / this.fieldLength;
        // this.columnCount = this.width / this.fieldLength;
        // for (var x = 0; x < this.rowCount; x++) {
        //     for (var y = 0; y < this.columnCount; y++) {
        //         let mapField = new MapField(x, y,"#FFFFFF", 1, this);
        //         this.mapFields.push(mapField);
        //         this.divElement.appendChild(mapField.getDivElement());
        //     }
        // }

        //From Server server holen
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("GET", "/mapload", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;

            m = JSON.parse(xhttp.responseText);
            //console.log(xhttp.responseText);
            self.width = m.width;
            self.height = m.height;
            self.fieldLength = m.fieldLength;
            self.rowCount = m.rowCount;
            self.columnCount = m.columnCount;
            self.mapFields = m.mapFields;
            self.generateMap();
        }
        xhttp.send();
    }

    generateMap() {
        let self = this;
        let body = document.querySelector("body");

        while (this.divElement.firstChild) {
            this.divElement.removeChild(this.divElement.firstChild);
        }

        body.style.setProperty('--mapFieldLength', this.fieldLength + "px")
        body.style.setProperty("--pixmapWidth", this.width + "px");
        body.style.setProperty("--pixmapHeight", this.height + "px")

        this.mapFields.forEach(function (mapField: MapField) {
            mapField.getDivElement = MapField.prototype.getDivElement; //Die Funktion kommt nicht aus dem JSON-Objekt und muss manuell zugewiesen werden.
            mapField.pixmap = self;
            self.divElement.appendChild(mapField.getDivElement());
        });
    }

    divElement: HTMLDivElement = document.getElementById("pixmap") as HTMLDivElement;
    mapFields: MapField[] = new Array<MapField>();
    private fieldLength: number;
    private columnCount: number;
    private rowCount: number;
    private height: number;
    private width: number;
}
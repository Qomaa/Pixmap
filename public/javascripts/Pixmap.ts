﻿class Pixmap {
    constructor() { }

    // saveTrytes() {
    //     let mapString = JSON.stringify(this, function (key: string, value: any) {
    //         if (key === "divElement" || key === "pixmap") return undefined;
    //         return value;
    //     });

    //     let m = JSON.parse(mapString);

    //     let xhttp: XMLHttpRequest = new XMLHttpRequest();
    //     xhttp.open("POST", "/mapsavetrytes", true);
    //     xhttp.setRequestHeader("Content-Type", "application/json")
    //     xhttp.send(mapString);
    // }

    load(callback: () => void) {
        let m: Pixmap;
        let self = this;
        let body = document.querySelector("body");

        //From Server server holen
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("GET", "/loadMap", true);
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
            callback();
            // self.generateMap();
            // self.convertToMongo();
        }
        xhttp.send();
    }

    convertToTrytes() {
        this.mapFields.forEach(function (mapField: MapField) {
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

        body.style.setProperty('--mapFieldLength', this.fieldLength + "px")
        body.style.setProperty("--pixmapWidth", this.width + "px");
        body.style.setProperty("--pixmapHeight", this.height + "px")

        this.mapFields.forEach(function (mapField: MapField) {
            mapField.getDivElement = MapField.prototype.getDivElement; //Die Funktion kommt nicht aus dem JSON-Objekt und muss manuell zugewiesen werden.
            mapField.pixmap = self;
            self.divElement.appendChild(mapField.getDivElement());
        });
    }

    generateMapPNG(mapField: MapField[], callback: (message: string) => void) {
        // var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
        // if (file.indexOf(dir + path.sep) !== 0) {
        //     return res.status(403).end('Forbidden');
        // }
        // var type = mime[path.extname(file).slice(1)] || 'text/plain';
        // var s = fs.createReadStream(file);
        // s.on('open', function () {
        //     res.set('Content-Type', type);
        //     s.pipe(res);
        // });
        // s.on('error', function () {
        //     res.set('Content-Type', 'text/plain');
        //     res.status(404).end('Not found');
        // });
    }

    divElement: HTMLDivElement = document.getElementById("pixmap") as HTMLDivElement;
    mapFields: MapField[] = new Array<MapField>();
    private fieldLength: number;
    private columnCount: number;
    private rowCount: number;
    private height: number;
    private width: number;
}
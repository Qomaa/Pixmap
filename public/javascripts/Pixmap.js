var Pixmap = /** @class */ (function () {
    function Pixmap() {
        this.divElement = document.getElementById("pixmap");
        this.mapFields = new Array();
    }
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
    Pixmap.prototype.load = function (callback) {
        var m;
        var self = this;
        var body = document.querySelector("body");
        //From Server server holen
        var xhttp = new XMLHttpRequest();
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
    };
    // loadTrytes() {
    //     let m: Pixmap;
    //     let self = this;
    //     let body = document.querySelector("body");
    //     // //Initial
    //     // this.width = 800;
    //     // this.height = 600;
    //     // this.fieldLength = 5;
    //     // body.style.setProperty("--pixmapWidth", this.width + "px");
    //     // body.style.setProperty("--pixmapHeight", this.height + "px");
    //     // body.style.setProperty('--mapFieldLength', this.fieldLength + "px");
    //     // this.rowCount = this.height / this.fieldLength;
    //     // this.columnCount = this.width / this.fieldLength;
    //     // for (var x = 0; x < this.rowCount; x++) {
    //     //     for (var y = 0; y < this.columnCount; y++) {
    //     //         let mapField = new MapField(x, y,"#FFFFFF", 1, this);
    //     //         this.mapFields.push(mapField);
    //     //         this.divElement.appendChild(mapField.getDivElement());
    //     //     }
    //     // }
    //     //From Server server holen
    //     let xhttp: XMLHttpRequest = new XMLHttpRequest();
    //     xhttp.open("GET", "/maploadtrytes", true);
    //     xhttp.setRequestHeader("Content-Type", "application/json")
    //     xhttp.onreadystatechange = function () {
    //         if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
    //         m = JSON.parse(xhttp.responseText);
    //         //console.log(xhttp.responseText);
    //         self.width = m.width;
    //         self.height = m.height;
    //         self.fieldLength = m.fieldLength;
    //         self.rowCount = m.rowCount;
    //         self.columnCount = m.columnCount;
    //         self.mapFields = m.mapFields;
    //         self.generateMap();
    //     }
    //     xhttp.send();
    // }
    // convertToMongo() {
    //     let self = this;
    //     console.log(this);
    //     this.mapFields.forEach(function( mapField: MapField){
    //         if (mapField.linkRef == undefined && mapField.messageRef == undefined) return ;
    //         // aktuellen msgText übertragen:
    //         let xhttp: XMLHttpRequest = new XMLHttpRequest();
    //         xhttp.open("GET", "/loadMessage2?messageRef=" + mapField.messageRef + "&x=" + mapField.x + "&y=" + mapField.y, false);
    //         xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    //         xhttp.send();
    //         if (xhttp.status == 200){
    //             mapField.message = xhttp.responseText;
    //             console.log("message x:" + mapField.x + " y: " + mapField.y + " -> " + mapField.message);
    //         }
    //         // aktuell link übertragen
    //         xhttp = new XMLHttpRequest();
    //         xhttp.open("GET", "/loadLink2?linkRef=" + mapField.linkRef + "&x=" + mapField.x + "&y=" + mapField.y, false);
    //         xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
    //         xhttp.send();
    //         if (xhttp.status == 200){
    //             mapField.link = xhttp.responseText;
    //             console.log("link x:" + mapField.x + " y: " + mapField.y + " -> " + mapField.link);
    //         }
    //     });
    //     //array speichern in mongo
    //     let mapString = JSON.stringify(self, function (key: string, value: any) {
    //         if (key === "divElement" || key === "pixmap") return undefined;
    //         return value;
    //     });
    //     let xhttp = new XMLHttpRequest();
    //     let m = JSON.parse(mapString);
    //     xhttp.open("POST", "/savemap", true);
    //     xhttp.setRequestHeader("Content-Type", "application/json")
    //     xhttp.send(mapString);
    //     console.log(mapString);
    //     console.log("DONE");
    // }
    Pixmap.prototype.convertToTrytes = function () {
        this.mapFields.forEach(function (mapField) {
            mapField.x = pad(numberToTrytes(+mapField.x), 2, "9");
            mapField.y = pad(numberToTrytes(+mapField.y), 2, "9");
        });
    };
    Pixmap.prototype.generateMap = function () {
        var self = this;
        var body = document.querySelector("body");
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
    };
    Pixmap.prototype.generateMapPNG = function (mapField, callback) {
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
    };
    return Pixmap;
}());
//# sourceMappingURL=Pixmap.js.map
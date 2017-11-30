class Map{
    constructor() { }

    Save() {
        let mapString = JSON.stringify(this, function (key: string, value: any) {
            if (key == "DivElement") return undefined;
            return value;
        });

        let m = JSON.parse(mapString);

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/mapsave", true);
        xhttp.setRequestHeader("Content-Type", "application/json" /*"text/plain"*/)
        xhttp.send(mapString);
    }

    Load() {
        let m: Map;
        let self = this;

        //Initial
        //this.Width = 400;
        //this.Height = 400;

        //self.DivElement.style.width = this.Width + "px";
        //self.DivElement.style.height = this.Height + "px";
        //self.RowCount = 50;
        //self.ColumnCount = 50;
        //let fieldWidth: number = this.Width / self.RowCount;
        //let fieldHeight: number = this.Height / self.ColumnCount;
        //for (var x = 0; x < self.RowCount; x++) {
        //    for (var y = 0; y < self.ColumnCount; y++) {
        //        let mapField = new MapField(x, y, fieldWidth, fieldHeight, "yellow");
        //        self.MapFields.push(mapField);
        //        self.DivElement.appendChild(mapField.GetDivElement());
        //    }
        //}

        //From Server server holen
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("GET", "/mapload", true);
        xhttp.setRequestHeader("Content-Type", "application/json" /*"text/plain"*/)
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;

            m = JSON.parse(xhttp.responseText);
            self.Width = m.Width;
            self.Height = m.Height;
            self.DivElement.style.width = m.Width + "px";
            self.DivElement.style.height = m.Height + "px";
            self.RowCount = m.RowCount;
            self.ColumnCount = m.ColumnCount;
            self.MapFields = m.MapFields;
            self.GenerateMap();
        }
        xhttp.send();
    }

    GenerateMap() {
        let self = this;

        while (this.DivElement.firstChild) {
            this.DivElement.removeChild(this.DivElement.firstChild);
        }

        this.MapFields.forEach(function (mapField: MapField) {
            mapField.GetDivElement = MapField.prototype.GetDivElement; //Die Funktion kommt nicht aus dem JSON-Objekt und muss manuell zugewiesen werden.
            
            self.DivElement.appendChild(mapField.GetDivElement());
        });
    }

    private DivElement = document.getElementById("map");
    private ColumnCount: number;
    private RowCount: number;
    private Height: number;
    private Width: number;
    private MapFields: MapField[] = new Array<MapField>();
}
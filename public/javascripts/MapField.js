var MapField = (function () {
    function MapField(x, y, width, height, color) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
    }
    MapField.prototype.GetDivElement = function () {
        var self = this;
        this.DivElement = document.createElement("div");
        this.DivElement.className = "mapfield";
        this.DivElement.id = "x" + this.X + "y" + this.Y;
        this.DivElement.style.width = this.Width.toString() + "px";
        this.DivElement.style.height = this.Height.toString() + "px";
        this.DivElement.style.backgroundColor = this.Color;
        this.DivElement.addEventListener("mouseenter", function (e) {
            this.style.backgroundColor = "blue";
        });
        this.DivElement.addEventListener("mouseleave", function (e) {
            this.style.backgroundColor = self.Color;
        });
        this.DivElement.addEventListener("mousedown", function (e) {
            var cc = document.getElementById("clickColor");
            self.Color = cc.style.backgroundColor;
        });
        return this.DivElement;
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map
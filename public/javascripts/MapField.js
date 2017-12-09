var MapField = /** @class */ (function () {
    function MapField(x, y, color, value, pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
    }
    MapField.prototype.getDivElement = function () {
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.setProperty('--mapFieldColor', this.color);
        return this.divElement;
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map
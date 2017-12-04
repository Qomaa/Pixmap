var MapField = /** @class */ (function () {
    function MapField(x, y, color, value, pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
    }
    MapField.prototype.getDivElement = function () {
        var self = this;
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.width = this.pixmap.fieldWidth + "px";
        this.divElement.style.height = this.pixmap.fieldHeight + "px";
        this.divElement.style.backgroundColor = this.color;
        this.divElement.addEventListener("mouseenter", function (e) {
            this.style.backgroundColor = "lightblue";
        });
        this.divElement.addEventListener("mouseleave", function (e) {
            this.style.backgroundColor = self.color;
        });
        this.divElement.addEventListener("mousedown", function (e) {
            // let cc = document.getElementById("clickcolor") as HTMLButtonElement;
            // self.color = rgb2hex(cc.style.backgroundColor);
            var editDialog = new EditDialog(self);
            editDialog.show();
        });
        return this.divElement;
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map
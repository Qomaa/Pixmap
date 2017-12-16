var MapField = /** @class */ (function () {
    function MapField(x, y, color, value, pixmap, linkref, messageRef) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.linkRef = linkref;
        this.messageRef = messageRef;
    }
    MapField.prototype.getDivElement = function () {
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.setProperty('--mapFieldColor', this.color);
        return this.divElement;
    };
    MapField.prototype.getMessage = function () {
        var message;
        //http
        message = "meine message";
        return message;
    };
    MapField.prototype.getHyperlink = function () {
        var hyperlink;
        hyperlink = "mein hyperlink";
        return hyperlink;
    };
    return MapField;
}());
//# sourceMappingURL=MapField.js.map
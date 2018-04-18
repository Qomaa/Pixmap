class MapField {
    constructor(x, y, color, value, message, link, transaction, timestamp, pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.message = message;
        this.link = link;
        this.transaction = transaction;
        this.timestamp = timestamp;
    }
    getDivElement() {
        let self = this;
        let tooltip;
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.setProperty('--mapFieldColor', this.color);
        tooltip = this.value + "i";
        if (this.link != undefined)
            tooltip = tooltip + "\r\n" + this.link;
        if (this.message != undefined)
            tooltip = tooltip + "\r\n" + this.message;
        this.divElement.setAttribute("title", tooltip);
        return this.divElement;
    }
}
//# sourceMappingURL=MapField.js.map
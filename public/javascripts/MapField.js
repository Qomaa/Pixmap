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
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.setProperty('--mapFieldColor', this.color);
        return this.divElement;
    }
    showTooltip(mouseX, mouseY) {
        let tt = document.querySelector("#tooltip");
        let ttColor = document.querySelector("#ttColor");
        let ttPos = document.querySelector("#ttPosition");
        let ttValue = document.querySelector("#ttValue");
        let ttMessage = document.querySelector("#ttMessage");
        let offset = 10;
        tt.style.top = (offset + this.divElement.offsetTop) + "px";
        tt.style.left = (offset + this.divElement.offsetLeft) + "px";
        ttColor.style.backgroundColor = this.color;
        ttPos.textContent = "X:" + (trytesToNumber(this.y) + 1) + " Y:" + (trytesToNumber(this.x) + 1);
        ttValue.textContent = this.value + "i";
        if (this.message != undefined) {
            ttMessage.textContent = this.message;
            ttMessage.style.display = "table-cell";
        }
        else {
            hideElement(ttMessage);
        }
        showElement(tt);
    }
}
//# sourceMappingURL=MapField.js.map
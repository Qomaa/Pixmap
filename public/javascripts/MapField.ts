class MapField {
    constructor(x: string, y: string, color: string, value: number, message: string, link: string, transaction: string, timestamp: string, pixmap: Pixmap) {
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

    getDivElement(): HTMLDivElement {
        let self = this;
        let tooltip: string;

        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;

        this.divElement.style.setProperty('--mapFieldColor', this.color);

        tooltip = "X:" + trytesToNumber(this.x + 1) + " Y:" + trytesToNumber(this.y + 1);
        tooltip = tooltip + "\r\n" + this.value + "i";
        if (this.link != undefined)
            tooltip = tooltip + "\r\n" + this.link;
        if (this.message != undefined)
            tooltip = tooltip + "\r\n" + this.message;

        this.divElement.setAttribute("title", tooltip);

        return this.divElement;
    }

    divElement: HTMLDivElement;
    pixmap: Pixmap;
    x: string;
    y: string;
    color: string;
    value: number;
    message: string;
    link: string;
    transaction: string;
    timestamp: string;
}

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
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;

        this.divElement.style.setProperty('--mapFieldColor', this.color);

        return this.divElement;
    }

    showTooltip(mouseX: number, mouseY: number) {
        let tt = document.querySelector("#tooltip") as HTMLTableElement;
        let ttColor = document.querySelector("#ttColor") as HTMLDivElement;
        let ttPos = document.querySelector("#ttPosition") as HTMLTableDataCellElement;
        let ttValue = document.querySelector("#ttValue") as HTMLTableDataCellElement;
        let ttMessage = document.querySelector("#ttMessage") as HTMLTableDataCellElement;
        let offset: number = 10;

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

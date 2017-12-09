class MapField {
    constructor(x: number, y: number, color: string, value: number, pixmap: Pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
    }

    getDivElement(): HTMLDivElement{
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;

        this.divElement.style.setProperty('--mapFieldColor', this.color);

        return this.divElement;
    }

    private divElement: HTMLDivElement;
    pixmap: Pixmap;
    x: number;
    y: number;   
    color: string;
    value: number;
}

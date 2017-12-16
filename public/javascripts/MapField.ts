class MapField {
    constructor(x: number, y: number, color: string, value: number, pixmap: Pixmap, linkref: string, messageRef: string) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
        this.linkRef = linkref;
        this.messageRef = messageRef;
    }

    getDivElement(): HTMLDivElement {
        this.divElement = document.createElement("div");
        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;

        this.divElement.style.setProperty('--mapFieldColor', this.color);

        return this.divElement;
    }

    getMessage(): string{
        let message: string;
        //http
        message ="meine message";

        return message;
    }

    getHyperlink(): string{
        let hyperlink: string;

        hyperlink ="mein hyperlink";

        return hyperlink;
    }

    private divElement: HTMLDivElement;
    pixmap: Pixmap;
    x: number;
    y: number;
    color: string;
    value: number;
    linkRef: string;
    messageRef: string;
}

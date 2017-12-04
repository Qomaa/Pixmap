class MapField {
    constructor(x: number, y: number, color: string, value: number, pixmap: Pixmap) {
        this.x = x;
        this.y = y;
        this.pixmap = pixmap;
        this.color = color;
        this.value = value;
    }

    getDivElement(): HTMLDivElement{
        let self = this;
        this.divElement = document.createElement("div");

        this.divElement.className = "mapfield";
        this.divElement.id = "x" + this.x + "y" + this.y;
        this.divElement.style.width = this.pixmap.fieldWidth + "px";
        this.divElement.style.height = this.pixmap.fieldHeight + "px";
        this.divElement.style.backgroundColor = this.color;

        this.divElement.addEventListener("mouseenter", function (e: MouseEvent) {
            this.style.backgroundColor = "lightblue";
        });

        this.divElement.addEventListener("mouseleave", function (e: MouseEvent) {
            this.style.backgroundColor = self.color;
        });

        this.divElement.addEventListener("mousedown", function (e: MouseEvent) {
            // let cc = document.getElementById("clickcolor") as HTMLButtonElement;
            // self.color = rgb2hex(cc.style.backgroundColor);
            let editDialog = new EditDialog(self);
            editDialog.show();
        });        

        return this.divElement;
    }

    private divElement: HTMLDivElement;
    pixmap: Pixmap;
    x: number;
    y: number;   
    color: string;
    value: number;
}

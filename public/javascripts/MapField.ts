
class MapField {
    constructor(x: number, y: number, width: number, height: number, color: string) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
    }

    GetDivElement(): HTMLDivElement{
        let self = this;
        this.DivElement = document.createElement("div");

        this.DivElement.className = "mapfield";
        this.DivElement.id = "x" + this.X + "y" + this.Y;
        this.DivElement.style.width = this.Width.toString() + "px";
        this.DivElement.style.height = this.Height.toString() + "px";
        this.DivElement.style.backgroundColor = this.Color;

        this.DivElement.addEventListener("mouseenter", function (e: MouseEvent) {
            this.style.backgroundColor = "blue";
        });

        this.DivElement.addEventListener("mouseleave", function (e: MouseEvent) {
            this.style.backgroundColor = self.Color;
        });

        this.DivElement.addEventListener("mousedown", function (e: MouseEvent) {
            let cc = document.getElementById("clickColor") as HTMLButtonElement;
            self.Color = cc.style.backgroundColor;
        });        

        return this.DivElement;
    }

    private DivElement: HTMLDivElement;
    X: number;
    Y: number;
    Width: number;
    Height: number;
    Color: string;
}

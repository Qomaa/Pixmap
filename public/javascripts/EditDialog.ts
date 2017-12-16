class EditDialog {
    constructor() {
        this.dialogDiv = document.getElementById("editDialog") as HTMLDivElement;
        this.position = document.getElementById("dialogXY") as HTMLSpanElement;
        this.xy = document.getElementById("XY") as HTMLSpanElement;
        this.value = document.getElementById("dialogValue") as HTMLSpanElement;
        this.transferIota = document.getElementById("transferIota") as HTMLInputElement;
        this.transferAddress = document.getElementById("transferAddress") as HTMLInputElement;
        this.transferTag = document.getElementById("transferTag") as HTMLInputElement;
        // this.hyperlink = document.getElementById("hyperlink") as HTMLLinkElement;
        // this.message = document.getElementById("message") as HTMLInputElement;

        this.transferAddress.addEventListener("click", e => this.transferAddress.select());
        this.transferTag.addEventListener("click", e => this.transferTag.select());
        this.transferIota.addEventListener("click", e => {
            this.transferIota.selectionStart = 0;
            this.transferIota.selectionEnd = this.transferIota.value.length - 1;
        });
    }

    show(mapField: MapField) {
        this.value.textContent = mapField.value.toString() + "i";
        this.position.textContent = "X:" + (mapField.x + 1) + "  Y:" + (mapField.y + 1);
        this.xy.textContent = " " + this.position.textContent;

        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = () => {
            this.colorHex = this.colorButton.jscolor.toHEXString();
            this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();

        this.transferIota.value = (mapField.value + 1).toString() + "i";
        this.transferAddress.value = RECEIVE_ADDRESS;
        
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    }

    hide() {
        this.dialogDiv.style.display = "none";
    }

    private updateTag(mapField: MapField) {
        let ascii: string;
        let tag: string;

        ascii = pad(mapField.x.toString(), 3, "0") +
            pad(mapField.y.toString(), 3, "0") +
            this.colorHex;

        tag = toTrytes(ascii);

        this.transferTag.value = tag;
    }

    dialogDiv: HTMLDivElement;
    private colorHex: string;
    private colorButton: any;
    private position: HTMLSpanElement;
    private xy: HTMLSpanElement;
    private value: HTMLSpanElement;
    private message: HTMLInputElement;
    private hyperlink: HTMLLinkElement;

    private transferIota: HTMLInputElement;
    private transferAddress: HTMLInputElement;
    private transferTag: HTMLInputElement;
}




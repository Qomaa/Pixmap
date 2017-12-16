class EditDialog {
    constructor() {
        this.dialogDiv = document.getElementById("editDialog") as HTMLDivElement;
        this.positionSpan = document.getElementById("dialogXY") as HTMLSpanElement;
        this.XYSpan = document.getElementById("XY") as HTMLSpanElement;
        this.valueSpan = document.getElementById("dialogValue") as HTMLSpanElement;
        this.transferIotaInput = document.getElementById("transferIota") as HTMLInputElement;
        this.transferAddressInput = document.getElementById("transferAddress") as HTMLInputElement;
        this.transferTagInput = document.getElementById("transferTag") as HTMLInputElement;

        this.transferAddressInput.addEventListener("click", e => this.transferAddressInput.select());
        this.transferTagInput.addEventListener("click", e => this.transferTagInput.select());
        this.transferIotaInput.addEventListener("click", e => {
            this.transferIotaInput.selectionStart = 0;
            this.transferIotaInput.selectionEnd = this.transferIotaInput.value.length - 1;
        });
    }

    show(mapField: MapField) {
        this.valueSpan.textContent = mapField.value.toString() + "i";
        this.positionSpan.textContent = "X:" + (mapField.x + 1) + "  Y:" + (mapField.y + 1);
        this.XYSpan.textContent = " " + this.positionSpan.textContent;

        this.colorButton = document.getElementById("dialogColor");

        this.colorButton.jscolor.onFineChange = () => {
            this.colorHex = this.colorButton.jscolor.toHEXString();
            this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();

        this.transferIotaInput.value = (mapField.value + 1).toString() + "i";
        this.transferAddressInput.value = RECEIVE_ADDRESS;
        
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    }

    hide() {
        this.dialogDiv.style.display = "none";
    }

    private updateTag(mapField: MapField) {
        let ascii: string;
        let tag: string;

        ascii = pad(mapField.x.toString(), 2, "0") +
            pad(mapField.y.toString(), 2, "0") +
            this.colorHex;

        tag = toTrytes(ascii);

        this.transferTagInput.value = tag;
    }

    dialogDiv: HTMLDivElement;
    private colorHex: string;
    private colorButton: any;
    private positionSpan: HTMLSpanElement;
    private XYSpan: HTMLSpanElement;
    private valueSpan: HTMLSpanElement;
    private transferIotaInput: HTMLInputElement;
    private transferAddressInput: HTMLInputElement;
    private transferTagInput: HTMLInputElement;
}




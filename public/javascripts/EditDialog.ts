class EditDialog{
    constructor(){
        this.closeSpan = document.getElementById("dialogClose");
        this.closeSpan.addEventListener("click", e => this.hide());

        this.dialogDiv = document.getElementById("editDialog") as HTMLDivElement;
        this.positionSpan = document.getElementById("dialogXY") as HTMLSpanElement;
        this.valueSpan = document.getElementById("dialogValue") as HTMLSpanElement;
        this.transferIotaSpan = document.getElementById("transferIota") as HTMLSpanElement;
        this.transferAddressSpan = document.getElementById("transferAddress") as HTMLSpanElement;
        this.transferTagSpan = document.getElementById("transferTag") as HTMLSpanElement;
    }

    show(mapField: MapField){
        this.valueSpan.textContent = mapField.value.toString();
        this.positionSpan.textContent = "X: " + (mapField.x+1) + "  Y: " + (mapField.y+1);               
        
        this.colorButton = document.getElementById("dialogColor");
        
        this.colorButton.jscolor.onFineChange = () => {
            this.colorHex = this.colorButton.jscolor.toHEXString();
            this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        
        this.updateInstruction(mapField);
        this.dialogDiv.style.display = "block";
    }

    hide(){
        this.dialogDiv.style.display = "none";
    }

    private updateInstruction(mapField: MapField){
        this.transferIotaSpan.textContent = (mapField.value + 1).toString() + " i" ;
        this.transferAddressSpan.textContent = RECEIVE_ADDRESS;
        this.updateTag(mapField);
    }

    private updateTag(mapField: MapField) {
        let ascii: string;
        let tag: string;
        
        ascii = pad(mapField.x.toString(),2,"0") +
                pad(mapField.y.toString(),2,"0") +
                this.colorHex;
        
        tag = toTrytes(ascii);
        
        this.transferTagSpan.textContent = tag;

        //console.log(fromTrytes(tag));
    }
    
    dialogDiv: HTMLDivElement;
    private colorHex: string;
    private closeSpan: HTMLSpanElement;
    private colorButton: any;
    private positionSpan: HTMLSpanElement;
    private valueSpan: HTMLSpanElement;
    private transferIotaSpan: HTMLSpanElement;
    private transferAddressSpan: HTMLSpanElement;
    private transferTagSpan: HTMLSpanElement;
}



        
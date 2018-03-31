class EditDialog {
    private urlRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);

    constructor() {
        this.dialogDiv = document.querySelector("#editDialog");
        this.position = document.querySelector("#dialogXY");
        this.xy = document.querySelector("#XY");
        this.iotas = document.querySelector("#iotas");
        this.value = document.querySelector("#dialogValue");
        this.timestamp = document.querySelector("#timestamp");
        this.transactionHash = document.querySelector("#transactionHash");
        this.transferIota = document.querySelector("#transferIota");
        this.transferAddress = document.querySelector("#transferAddress");
        this.transferTag = document.querySelector("#transferTag");
        this.linkError = document.querySelector("#linkError");
        this.desiredLink = document.querySelector("#desiredLink");
        this.desiredMessage = document.querySelector("#desiredMessage");
        this.currentContent = document.querySelector("#currentContent");
        this.currentLink = document.querySelector("#currentLink");
        this.currentMessage = document.querySelector("#currentMessage");

        this.transferAddress.addEventListener("click", e => this.transferAddress.select());
        this.transferTag.addEventListener("click", e => this.transferTag.select());
        this.transferIota.addEventListener("click", e => {
            this.transferIota.selectionStart = 0;
            this.transferIota.selectionEnd = this.transferIota.value.length - 1;
        });
    }

    show(mapField: MapField) {
        let self = this;
        
        //Current values
        this.position.textContent = "X:" + (trytesToNumber(mapField.x) + 1) + "  Y:" + (trytesToNumber(mapField.y) + 1);
        if (mapField.timestamp != undefined)
            this.timestamp.textContent = new Date(+mapField.timestamp).toLocaleString();

        if (mapField.transaction != undefined){
            this.transactionHash.textContent = "tx on thetangle.org";
            this.transactionHash.href ="https://thetangle.org/transaction/" + mapField.transaction;
        }
        this.value.textContent = mapField.value.toString() + "i";
        this.displayMessage(mapField.message, mapField.link);

        //User desired values
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = () => {
            this.colorHex = this.colorButton.jscolor.toHEXString();
            this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.linkError.style.display = "none";
        this.desiredLink.onblur = function updateLink(e) {
            let link = self.desiredLink.value;
            if (link == "") return;

            if (!self.urlRegEx.test(link))
                self.linkError.style.display = "block";

            self.updateMessage(self, mapField);
        }
        this.desiredMessage.onblur = function updateMessage(e) {
            if (self.desiredMessage.value == "") return;
            self.updateMessage(self, mapField);
        }

        //Transfer/Description
        this.transferIota.value = (mapField.value + 1).toString() + "i";
        this.iotas.textContent = " " + (mapField.value + 1).toString() + " ";
        this.transferAddress.value = RECEIVE_ADDRESS;
        this.xy.textContent = " " + this.position.textContent;

        //Update Tag
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    }

    hide() {
        //Reset values
        this.messageNum = undefined;
        this.desiredLink.value = "";
        this.desiredMessage.value = "";
        this.currentMessage.value = "";
        this.currentLink.textContent = "";
        this.timestamp.textContent = "";
        this.transactionHash.textContent = "";
        this.transactionHash.href = "";
        this.linkError.style.display = "none";

        this.dialogDiv.style.display = "none";
    }

    private updateTag(mapField: MapField) {
        let tag: string;
        let r: string;
        let g: string;
        let b: string;
        let message: string = "9999999999999999";

        r = pad(numberToTrytes(parseInt(this.colorHex.substring(1, 3), 16)), 2, "9");
        g = pad(numberToTrytes(parseInt(this.colorHex.substring(3, 5), 16)), 2, "9");
        b = pad(numberToTrytes(parseInt(this.colorHex.substring(5, 7), 16)), 2, "9");

        if (this.messageNum != undefined) message = pad(numberToTrytes(this.messageNum), 16, "9");

        tag = pad(mapField.x, 2, "9") + pad(mapField.y, 2, "9") + r + g + b + message;

        this.transferTag.value = trimEnd(tag, "9");
    }

    private displayMessage(message: string, link: string) {
        this.currentContent.style.display = "none";
        
        if (message != undefined && message != "") {
            this.currentContent.style.display = "block";
            this.currentMessage.value = message;
        }

        if (link != undefined && link != "") {
            this.currentContent.style.display = "block";

            if (this.urlRegEx.test(link))
                this.currentLink.href = link;
            else
                this.currentLink.href = "http://" + link;

            if (link.length > 80) {
                link = link.substring(0, 80) + "...";
            }
            this.currentLink.textContent = link;
        }
    }

    private updateMessage(self: any, mapField: MapField) {
        if (self.messageNum == undefined) {
            self.getNewMsgRef(mapField.x, mapField.y, () => {
                self.storeMessage(mapField.x, mapField.y);
                self.updateTag(mapField);
            });
        } else {
            self.storeMessage(mapField.x, mapField.y);
        }
    }

    private getNewMsgRef(x: string, y: string, callback: () => void) {
        let self = this;
        let xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.open("GET", "/getMessageNum?x=" + x + "&y=" + y + "&clientID=" + CLIENT_ID, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            self.messageNum = +xhttp.responseText;
            callback();
        }
        xhttp.send();
    }
    private storeMessage(posX: string, posY: string) {
        let message = {
            clientID: CLIENT_ID,
            x: posX,
            y: posY,
            num: this.messageNum,
            message: this.desiredMessage.value,
            link: this.desiredLink.value
        }

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/storeMessage", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(JSON.stringify(message));
    }

    dialogDiv: HTMLDivElement;
    private colorHex: string;
    private colorButton: any;
    private position: HTMLSpanElement;
    private xy: HTMLSpanElement;
    private timestamp: HTMLSpanElement;
    private transactionHash: HTMLLinkElement;
    private iotas: HTMLSpanElement;
    private value: HTMLSpanElement;
    private currentContent: HTMLDivElement;
    private currentMessage: HTMLTextAreaElement;
    private currentLink: HTMLLinkElement;

    private transferIota: HTMLInputElement;
    private transferAddress: HTMLInputElement;
    private transferTag: HTMLInputElement;

    private desiredLink: HTMLInputElement;
    private linkError: HTMLParagraphElement;
    private desiredMessage: HTMLInputElement;

    private messageNum: number;
}




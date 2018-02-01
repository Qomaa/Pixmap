class EditDialog {
    constructor() {
        this.dialogDiv = document.querySelector("#editDialog");
        this.position = document.querySelector("#dialogXY");
        this.xy = document.querySelector("#XY");
        this.iotas = document.querySelector("#iotas");
        this.value = document.querySelector("#dialogValue");
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
        let urlRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);

        //Current values
        this.position.textContent = "X:" + (trytesToNumber(mapField.x) + 1) + "  Y:" + (trytesToNumber(mapField.y) + 1);
        this.value.textContent = mapField.value.toString() + "i";
        this.currentContent.style.display = "none";
        mapField.loadMessage(self.displayMessage);
        mapField.loadLink(self.displayLink);

        //User desired values
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = () => {
            this.colorHex = this.colorButton.jscolor.toHEXString();
            this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.linkError.style.display = "none";
        this.desiredLink.onblur = e => {
            let link = self.desiredLink.value;
            if (link == "") return;

            if (!urlRegEx.test(link))
                self.linkError.style.display = "block";

            if (self.linkRef == undefined) {
                self.getNewLinkRef(mapField.x, mapField.y, () => {
                    self.storeLink(mapField.x, mapField.y);
                    self.updateTag(mapField);
                });
                return;
            }
            self.storeLink(mapField.x, mapField.y);
        }
        this.desiredMessage.onblur = e => {
            if (self.desiredMessage.value == "") return;
            if (self.messageRef == undefined) {
                self.getNewMessageRef(mapField.x, mapField.y, () => {
                    self.storeMessage(mapField.x, mapField.y);
                    self.updateTag(mapField);
                });
                return;
            }
            self.storeMessage(mapField.x, mapField.y);
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
        this.messageRef = undefined;
        this.linkRef = undefined;
        this.desiredLink.value = "";
        this.desiredMessage.value = "";
        this.currentMessage.value = "";
        this.currentLink.textContent = "";
        this.linkError.style.display = "none";

        this.dialogDiv.style.display = "none";
    }

    private updateTag(mapField: MapField) {
        let tag: string;
        let r: string;
        let g: string;
        let b: string;
        let message: string = "99999999";
        let link: string = "99999999";

        r = pad(numberToTrytes(parseInt(this.colorHex.substring(1, 3), 16)), 2, "9");
        g = pad(numberToTrytes(parseInt(this.colorHex.substring(3, 5), 16)), 2, "9");
        b = pad(numberToTrytes(parseInt(this.colorHex.substring(5, 7), 16)), 2, "9");

        if (this.messageRef != undefined) message = pad(numberToTrytes(this.messageRef), 8, "9");
        if (this.linkRef != undefined) link = pad(numberToTrytes(this.linkRef), 8, "9");

        tag = pad(mapField.x, 2, "9") + pad(mapField.y, 2, "9") + r + g + b + message + link;

        this.transferTag.value = tag;
    }

    private displayMessage(message: string) {
        if (message == "") return;
        this.currentContent.style.display = "block";
        this.currentMessage.value = message;
    }

    private displayLink(link: string) {
        if (link == "") return;

        this.currentContent.style.display = "block";
        
        this.currentLink.href = link;
        if (link.length > 80) {
            link = link.substring(0, 80) + "...";
        }
        this.currentLink.textContent = link;
    }

    private storeMessage(posX: string, posY: string) {
        let message = {
            clientID: CLIENT_ID,
            x: posX,
            y: posY,
            messageRef: this.messageRef,
            message: this.desiredMessage.value
        }

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/storeMessage", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(JSON.stringify(message));
    }

    private storeLink(posX: string, posY: string) {
        let link = {
            clientID: CLIENT_ID,
            x: posX,
            y: posY,
            linkRef: this.linkRef,
            link: this.desiredLink.value
        }

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/storeLink", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(JSON.stringify(link));
    }

    private getNewMessageRef(x: string, y: string, callback: () => void) {
        let self = this;
        let xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.open("GET", "/getMessageRef?x=" + x + "&y=" + y + "&clientID=" + CLIENT_ID, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            self.messageRef = +xhttp.responseText;
            callback();
        }
        xhttp.send();
    }

    private getNewLinkRef(x: string, y: string, callback: () => void) {
        let self = this;
        let xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.open("GET", "/getLinkRef?x=" + x + "&y=" + y + "&clientID=" + CLIENT_ID, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            self.linkRef = +xhttp.responseText;
            callback();
        }
        xhttp.send();
    }

    dialogDiv: HTMLDivElement;
    private colorHex: string;
    private colorButton: any;
    private position: HTMLSpanElement;
    private xy: HTMLSpanElement;
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

    private linkRef: number;
    private messageRef: number;
}




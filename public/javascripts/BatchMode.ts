class BatchMode {
    constructor(pixmap: Pixmap) {
        let self = this;
        this.pixmap = pixmap;
        this.batchModeDiv = document.querySelector("#batchMode") as HTMLDivElement;
        this.transferIota = document.querySelector("#batchTransferIota") as HTMLInputElement;
        this.toggleBatchModeButton = document.querySelector("#toggleBatchMode") as HTMLDivElement;
        this.additionalIotas = document.querySelector("#batchAdditionalIotas") as HTMLInputElement;
        this.linkError = document.querySelector("#batchLinkError") as HTMLParagraphElement;
        this.batchError = document.querySelector("#batchError") as HTMLDivElement;
        this.desiredLink = document.querySelector("#batchDesiredLink") as HTMLInputElement;
        this.desiredMessage = document.querySelector("#batchDesiredMessage") as HTMLInputElement;

        this.additionalIotas.value = String(this.getAdditionalIotas());
        this.additionalIotas.addEventListener("blur", ev => {
            this.additionalIotas.value = String(this.getAdditionalIotas());
        });

        this.doneBatchButton = document.querySelector("#batchDone") as HTMLDivElement;
        this.doneBatchButton.addEventListener("click", ev => {
            if (self.changedMapFields.length === 0) {
                showElement(self.batchError);
                return;
            }
            this.doneBatchButton.textContent = "...";
            let dialog = new EditDialog();

            this.getTag(tag => {
                self.storeChangedFields(tag);
                dialog.showBatch(this.transferIota.value, tag);
                self.disable();
            });
        });
    }

    private getTag(callback: (tag: string) => void) {
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        let self = this;

        //Nächsten Tag holen
        xhttp.open("GET", "/getNextBatchTag?clientID=" + CLIENT_ID, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8")
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200) return;
            callback(xhttp.responseText);
        }
        xhttp.send();
    }

    enable() {
        let self = this;
        this.toggleBatchModeButton.textContent = "...";
        this.doneBatchButton.textContent = "Done";
        this.toggleBatchModeButton.textContent = "Batch Mode active";
        this.toggleBatchModeButton.style.backgroundColor = "#ff9100";
        this.toggleBatchModeButton.style.color = "#0600ff";
        this.toggleBatchModeButton.style.borderRadius = "7px 7px 0px 0px";
        this.pixmap.divElement.style.borderColor = "#ff9100";
        hideElement(this.linkError);
        hideElement(this.batchError);

        this.desiredLink.onblur = function updateLink(e) {
            let link = self.desiredLink.value;
            if (link == "") return;

            if (!self.urlRegEx.test(link))
                showElement(self.linkError);
            else
                hideElement(self.linkError);
        }

        self.pixmap.divElement.style.cursor = "default";
        self.changedMapFields = [];
        self.backupFields = [];
        self.value = 0;
        
        showElement(this.batchModeDiv);
        self.isEnabled = true;
    }

    disable() {
        let self = this;

        hideElement(this.batchModeDiv);
        this.toggleBatchModeButton.textContent = "Setting dots one by one is too slow? Try Batch Mode!";
        this.toggleBatchModeButton.style.borderRadius = null;
        this.toggleBatchModeButton.style.backgroundColor = null;
        this.toggleBatchModeButton.style.color = null;
        this.pixmap.divElement.style.cursor = null;
        this.pixmap.divElement.style.borderColor = null;

        this.transferIota.value = "";
        this.colorHex = "";

        this.backupFields.forEach(field => {
            field.divElement.style.setProperty("--mapFieldColor", field.color);
        });

        this.isEnabled = false;
    }

    setField(originalField: MapField) {
        let self = this;
        let fieldToSave: MapField;
        let index: number;
        let link: string;
        let message: string;
        let newFieldValue: number;

        this.colorHex = (document.querySelector("#batchColorPicker") as any).jscolor.toHEXString();
        link = this.desiredLink.value;
        message = this.desiredMessage.value;
        newFieldValue = originalField.value + this.getAdditionalIotas();

        fieldToSave = this.changedMapFields.find((item, i) => {
            index = i;
            return item.x === originalField.x && item.y === originalField.y;
        });

        if (fieldToSave === undefined) {
            fieldToSave = new MapField(originalField.x, originalField.y, this.colorHex, newFieldValue, message, link, null, null, null);
            this.changedMapFields.push(fieldToSave);
            this.backupFields.push(originalField);
            this.value = this.value + newFieldValue;
        }
        else {
            this.value = this.value - fieldToSave.value + newFieldValue;
            fieldToSave.value = newFieldValue;
            fieldToSave.color = this.colorHex;
            fieldToSave.message = message;
            fieldToSave.link = link;
        }

        this.transferIota.value = String(this.value) + "i";

        hideElement(this.batchError);
        originalField.divElement.style.setProperty("--mapFieldColor", this.colorHex);
    }

    private storeChangedFields(tag: string) {
        let batch = {
            clientID: CLIENT_ID,
            tag: tag,
            changedFields: this.changedMapFields
        }

        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.open("POST", "/storeBatch", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(JSON.stringify(batch));
    }

    private getAdditionalIotas(): number {
        let i: number = Number(this.additionalIotas.value);

        if (i === undefined || i === NaN || i < 1) return 1;
        if (i > 1000000) return 1000000;
        return i;
    }

    public divElement: HTMLDivElement = document.getElementById("toggleBatchMode") as HTMLDivElement;
    public isEnabled: boolean;

    private pixmap: Pixmap;
    private changedMapFields: MapField[];
    private backupFields: MapField[];

    private colorHex: string;
    private value: number;

    private linkError: HTMLParagraphElement;
    private batchError: HTMLDivElement;

    private desiredLink: HTMLInputElement;
    private desiredMessage: HTMLInputElement;

    private batchModeDiv: HTMLDivElement;
    private toggleBatchModeButton: HTMLDivElement;
    private additionalIotas: HTMLInputElement;
    private doneBatchButton: HTMLDivElement;
    private transferIota: HTMLInputElement;

    private urlRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);
}
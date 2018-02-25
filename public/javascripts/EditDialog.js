var EditDialog = /** @class */ (function () {
    function EditDialog() {
        var _this = this;
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
        this.transferAddress.addEventListener("click", function (e) { return _this.transferAddress.select(); });
        this.transferTag.addEventListener("click", function (e) { return _this.transferTag.select(); });
        this.transferIota.addEventListener("click", function (e) {
            _this.transferIota.selectionStart = 0;
            _this.transferIota.selectionEnd = _this.transferIota.value.length - 1;
        });
    }
    EditDialog.prototype.show = function (mapField) {
        var _this = this;
        var self = this;
        var urlRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);
        //Current values
        this.position.textContent = "X:" + (trytesToNumber(mapField.x) + 1) + "  Y:" + (trytesToNumber(mapField.y) + 1);
        this.value.textContent = mapField.value.toString() + "i";
        this.displayMessage(mapField.message, mapField.link);
        //User desired values
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = function () {
            _this.colorHex = _this.colorButton.jscolor.toHEXString();
            _this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.linkError.style.display = "none";
        this.desiredLink.onblur = function updateLink(e) {
            var link = self.desiredLink.value;
            if (link == "")
                return;
            if (!urlRegEx.test(link))
                self.linkError.style.display = "block";
            self.updateMessage(self, mapField);
        };
        this.desiredMessage.onblur = function updateMessage(e) {
            if (self.desiredMessage.value == "")
                return;
            self.updateMessage(self, mapField);
        };
        //Transfer/Description
        this.transferIota.value = (mapField.value + 1).toString() + "i";
        this.iotas.textContent = " " + (mapField.value + 1).toString() + " ";
        this.transferAddress.value = RECEIVE_ADDRESS;
        this.xy.textContent = " " + this.position.textContent;
        //Update Tag
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    };
    EditDialog.prototype.hide = function () {
        //Reset values
        this.messageNum = undefined;
        this.desiredLink.value = "";
        this.desiredMessage.value = "";
        this.currentMessage.value = "";
        this.currentLink.textContent = "";
        this.linkError.style.display = "none";
        this.dialogDiv.style.display = "none";
    };
    EditDialog.prototype.updateTag = function (mapField) {
        var tag;
        var r;
        var g;
        var b;
        var message = "9999999999999999";
        r = pad(numberToTrytes(parseInt(this.colorHex.substring(1, 3), 16)), 2, "9");
        g = pad(numberToTrytes(parseInt(this.colorHex.substring(3, 5), 16)), 2, "9");
        b = pad(numberToTrytes(parseInt(this.colorHex.substring(5, 7), 16)), 2, "9");
        if (this.messageNum != undefined)
            message = pad(numberToTrytes(this.messageNum), 16, "9");
        tag = pad(mapField.x, 2, "9") + pad(mapField.y, 2, "9") + r + g + b + message;
        this.transferTag.value = tag;
    };
    EditDialog.prototype.displayMessage = function (message, link) {
        this.currentContent.style.display = "none";
        if (message != undefined && message != "") {
            this.currentContent.style.display = "block";
            this.currentMessage.value = message;
        }
        if (link != undefined && link != "") {
            this.currentContent.style.display = "block";
            this.currentLink.href = link;
            if (link.length > 80) {
                link = link.substring(0, 80) + "...";
            }
            this.currentLink.textContent = link;
        }
    };
    EditDialog.prototype.updateMessage = function (self, mapField) {
        if (self.messageNum == undefined) {
            self.getNewMsgRef(mapField.x, mapField.y, function () {
                self.storeMessage(mapField.x, mapField.y);
                self.updateTag(mapField);
            });
        }
        else {
            self.storeMessage(mapField.x, mapField.y);
        }
    };
    EditDialog.prototype.getNewMsgRef = function (x, y, callback) {
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/getMessageNum?x=" + x + "&y=" + y + "&clientID=" + CLIENT_ID, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            self.messageNum = +xhttp.responseText;
            callback();
        };
        xhttp.send();
    };
    EditDialog.prototype.storeMessage = function (posX, posY) {
        var message = {
            clientID: CLIENT_ID,
            x: posX,
            y: posY,
            num: this.messageNum,
            message: this.desiredMessage.value,
            link: this.desiredLink.value
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/storeMessage", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(message));
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map
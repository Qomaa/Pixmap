var EditDialog = /** @class */ (function () {
    function EditDialog() {
        var _this = this;
        this.dialogDiv = document.getElementById("editDialog");
        this.position = document.getElementById("dialogXY");
        this.xy = document.getElementById("XY");
        this.iotas = document.getElementById("Iotas");
        this.value = document.getElementById("dialogValue");
        this.transferIota = document.getElementById("transferIota");
        this.transferAddress = document.getElementById("transferAddress");
        this.transferTag = document.getElementById("transferTag");
        this.desiredLink = document.getElementById("desiredLink");
        this.desiredMessage = document.getElementById("desiredMessage");
        this.currentLink = document.getElementById("currentLink");
        this.currentMessage = document.getElementById("currentMessage");
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
        var httpRegEx = new RegExp("/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/");
        //Current values
        this.position.textContent = "X:" + (trytesToNumber(mapField.x) + 1) + "  Y:" + (trytesToNumber(mapField.y) + 1);
        this.value.textContent = mapField.value.toString() + "i";
        mapField.loadMessage(function (message) {
            self.currentMessage.textContent = message;
        });
        mapField.loadLink(function (link) {
            self.currentLink.href = link;
            if (link.length > 50) {
                link = link.substring(0, 50) + "...";
            }
            self.currentLink.textContent = link;
        });
        //User desired values
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = function () {
            _this.colorHex = _this.colorButton.jscolor.toHEXString();
            _this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.desiredLink.onblur = function (e) {
            var link = self.desiredLink.value;
            if (self.desiredLink.value == "")
                return;
            // if (!httpRegEx.test(link)) {
            //     // not valid
            //     self.desiredLink.style.borderColor = "red";
            //     return;
            // }
            if (self.linkRef == undefined) {
                self.getNewLinkRef(mapField.x, mapField.y, function () {
                    self.storeLink(mapField.x, mapField.y);
                    self.updateTag(mapField);
                });
                return;
            }
            self.storeLink(mapField.x, mapField.y);
        };
        this.desiredMessage.onblur = function (e) {
            if (self.desiredMessage.value == "")
                return;
            if (self.messageRef == undefined) {
                self.getNewMessageRef(mapField.x, mapField.y, function () {
                    self.storeMessage(mapField.x, mapField.y);
                    self.updateTag(mapField);
                });
                return;
            }
            self.storeMessage(mapField.x, mapField.y);
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
        this.dialogDiv.style.display = "none";
        //Reset values
        this.messageRef = undefined;
        this.linkRef = undefined;
        this.desiredLink.value = "";
        this.desiredMessage.value = "";
    };
    EditDialog.prototype.updateTag = function (mapField) {
        var tag;
        var r;
        var g;
        var b;
        var message = "99999999";
        var link = "99999999";
        r = pad(numberToTrytes(parseInt(this.colorHex.substring(1, 3), 16)), 2, "9");
        g = pad(numberToTrytes(parseInt(this.colorHex.substring(3, 5), 16)), 2, "9");
        b = pad(numberToTrytes(parseInt(this.colorHex.substring(5, 7), 16)), 2, "9");
        if (this.messageRef != undefined)
            message = pad(numberToTrytes(this.messageRef), 8, "9");
        if (this.linkRef != undefined)
            link = pad(numberToTrytes(this.linkRef), 8, "9");
        tag = pad(mapField.x, 2, "9") + pad(mapField.y, 2, "9") + r + g + b + message + link;
        this.transferTag.value = tag;
    };
    EditDialog.prototype.storeMessage = function (posX, posY) {
        var message = {
            x: posX,
            y: posY,
            messageRef: this.messageRef,
            message: this.desiredMessage.value
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/storeMessage", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(message));
    };
    EditDialog.prototype.storeLink = function (posX, posY) {
        var link = {
            x: posX,
            y: posY,
            linkRef: this.linkRef,
            link: this.desiredLink.value
        };
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/storeLink", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(link));
    };
    EditDialog.prototype.getNewMessageRef = function (x, y, callback) {
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/getMessageRef?x=" + x + "&y=" + y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            self.messageRef = +xhttp.responseText;
            callback();
        };
        xhttp.send();
    };
    EditDialog.prototype.getNewLinkRef = function (x, y, callback) {
        var self = this;
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/getLinkRef?x=" + x + "&y=" + y, true);
        xhttp.setRequestHeader("Content-Type", "text/html; charset=utf-8");
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState !== XMLHttpRequest.DONE || xhttp.status !== 200)
                return;
            self.linkRef = +xhttp.responseText;
            callback();
        };
        xhttp.send();
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map
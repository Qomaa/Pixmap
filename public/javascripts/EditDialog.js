var EditDialog = /** @class */ (function () {
    function EditDialog() {
        var _this = this;
        this.dialogDiv = document.getElementById("editDialog");
        this.position = document.getElementById("dialogXY");
        this.xy = document.getElementById("XY");
        this.value = document.getElementById("dialogValue");
        this.transferIota = document.getElementById("transferIota");
        this.transferAddress = document.getElementById("transferAddress");
        this.transferTag = document.getElementById("transferTag");
        // this.hyperlink = document.getElementById("hyperlink") as HTMLLinkElement;
        // this.message = document.getElementById("message") as HTMLInputElement;
        this.transferAddress.addEventListener("click", function (e) { return _this.transferAddress.select(); });
        this.transferTag.addEventListener("click", function (e) { return _this.transferTag.select(); });
        this.transferIota.addEventListener("click", function (e) {
            _this.transferIota.selectionStart = 0;
            _this.transferIota.selectionEnd = _this.transferIota.value.length - 1;
        });
    }
    EditDialog.prototype.show = function (mapField) {
        var _this = this;
        this.value.textContent = mapField.value.toString() + "i";
        this.position.textContent = "X:" + (mapField.x + 1) + "  Y:" + (mapField.y + 1);
        this.xy.textContent = " " + this.position.textContent;
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = function () {
            _this.colorHex = _this.colorButton.jscolor.toHEXString();
            _this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.transferIota.value = (mapField.value + 1).toString() + "i";
        this.transferAddress.value = RECEIVE_ADDRESS;
        this.updateTag(mapField);
        this.dialogDiv.style.display = "block";
    };
    EditDialog.prototype.hide = function () {
        this.dialogDiv.style.display = "none";
    };
    EditDialog.prototype.updateTag = function (mapField) {
        var ascii;
        var tag;
        ascii = pad(mapField.x.toString(), 3, "0") +
            pad(mapField.y.toString(), 3, "0") +
            this.colorHex;
        tag = toTrytes(ascii);
        this.transferTag.value = tag;
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map
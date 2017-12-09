var EditDialog = /** @class */ (function () {
    function EditDialog() {
        var _this = this;
        this.closeSpan = document.getElementById("dialogClose");
        this.closeSpan.addEventListener("click", function (e) { return _this.hide(); });
        this.dialogDiv = document.getElementById("editDialog");
        this.positionSpan = document.getElementById("dialogXY");
        this.valueSpan = document.getElementById("dialogValue");
        this.transferIotaSpan = document.getElementById("transferIota");
        this.transferAddressSpan = document.getElementById("transferAddress");
        this.transferTagSpan = document.getElementById("transferTag");
    }
    EditDialog.prototype.show = function (mapField) {
        var _this = this;
        this.valueSpan.textContent = mapField.value.toString();
        this.positionSpan.textContent = "X: " + (mapField.x + 1) + "  Y: " + (mapField.y + 1);
        this.colorButton = document.getElementById("dialogColor");
        this.colorButton.jscolor.onFineChange = function () {
            _this.colorHex = _this.colorButton.jscolor.toHEXString();
            _this.updateTag(mapField);
        };
        this.colorButton.jscolor.fromString(mapField.color);
        this.colorHex = this.colorButton.jscolor.toHEXString();
        this.updateInstruction(mapField);
        this.dialogDiv.style.display = "block";
    };
    EditDialog.prototype.hide = function () {
        this.dialogDiv.style.display = "none";
    };
    EditDialog.prototype.updateInstruction = function (mapField) {
        this.transferIotaSpan.textContent = (mapField.value + 1).toString() + " i";
        this.transferAddressSpan.textContent = RECEIVE_ADDRESS;
        this.updateTag(mapField);
    };
    EditDialog.prototype.updateTag = function (mapField) {
        var ascii;
        var tag;
        ascii = pad(mapField.x.toString(), 2, "0") +
            pad(mapField.y.toString(), 2, "0") +
            this.colorHex;
        tag = toTrytes(ascii);
        this.transferTagSpan.textContent = tag;
        //console.log(fromTrytes(tag));
    };
    return EditDialog;
}());
//# sourceMappingURL=EditDialog.js.map